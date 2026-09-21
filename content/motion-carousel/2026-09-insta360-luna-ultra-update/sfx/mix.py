#!/usr/bin/env python3
"""Sound design for the Luna Ultra motion carousel.

Synthesises a small SFX library (no samples, no licensing), lays the events from
sfx-plan.json onto one track per slide, optionally ducks a background audio file
(bg-audio.mp3 next to this script) under them, and muxes the result into the
rendered MP4s without touching the video stream.

usage: python3 mix.py <work-dir>
  reads  <work>/exports/slides/NN.mp4 and <work>/exports/carousel-preview.mp4
  writes <work>/exports/audio/NN.wav and <work>/exports/final/*.mp4
"""
import json, math, os, subprocess, sys, wave
import numpy as np

SR = 48000
W = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)) + '/..'
W = os.path.abspath(W)
HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = json.load(open(os.path.join(HERE, 'sfx-plan.json'), encoding='utf-8'))
FFMPEG = os.path.join(W, 'remotion-carousel/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg')
if not os.path.exists(FFMPEG):
    FFMPEG = 'ffmpeg'

rng = np.random.default_rng(7)


def env(n, a, d, s=0.0, r=None, curve=1.0):
    """attack / decay / sustain / release envelope in seconds, returns n samples"""
    a, d = int(a * SR), int(d * SR)
    r = int((r if r is not None else 0) * SR)
    e = np.zeros(n)
    i = 0
    if a:
        e[:a] = np.linspace(0, 1, a) ** curve
        i = a
    if d:
        seg = np.linspace(1, s, d) ** curve
        e[i:i + d] = seg[:max(0, n - i)]
        i += d
    if i < n:
        e[i:] = s
    if r and n - r > 0:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def bandpass(x, lo, hi):
    """static band-pass through the FFT (good enough for short noise-based effects)"""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    mask = np.zeros_like(f)
    inside = (f >= lo) & (f <= hi)
    mask[inside] = 1
    # soften the edges over a third of an octave
    edge = (f > lo / 1.26) & (f < lo)
    mask[edge] = np.linspace(0, 1, edge.sum()) if edge.any() else mask[edge]
    edge = (f > hi) & (f < hi * 1.26)
    mask[edge] = np.linspace(1, 0, edge.sum()) if edge.any() else mask[edge]
    return np.fft.irfft(X * mask, n=len(x))


def sine(freq, n, glide_to=None):
    t = np.arange(n) / SR
    if glide_to is None:
        return np.sin(2 * math.pi * freq * t)
    fr = np.geomspace(freq, glide_to, n)
    ph = 2 * math.pi * np.cumsum(fr) / SR
    return np.sin(ph)


def noise(n):
    return rng.standard_normal(n)


# ---- library -----------------------------------------------------------------
def sfx_air(dur=0.7):
    n = int(dur * SR)
    return bandpass(noise(n), 120, 900) * env(n, 0.25, 0.45, 0, None, 1.4) * 0.5


def sfx_pop(dur=0.09):
    n = int(dur * SR)
    return sine(950, n, 520) * env(n, 0.003, 0.085) * 0.55


def sfx_thud(dur=0.26):
    n = int(dur * SR)
    body = sine(95, n, 62) * env(n, 0.002, 0.25)
    click = bandpass(noise(n), 800, 2500) * env(n, 0.001, 0.02)
    return body * 0.9 + click * 0.25


def sfx_whoosh(dur=0.5):
    n = int(dur * SR)
    layer = bandpass(noise(n), 350, 2600) * env(n, 0.22, 0.28, 0, None, 1.6)
    tail = sine(420, n, 180) * env(n, 0.2, 0.3) * 0.12
    return layer * 0.6 + tail


def sfx_riser(dur=2.8):
    n = int(dur * SR)
    tone = sine(180, n, 1100) * 0.35 + sine(360, n, 2200) * 0.12
    breath = bandpass(noise(n), 500, 5000) * 0.35
    e = env(n, dur * 0.85, dur * 0.15, 0, None, 2.2)
    return (tone + breath) * e * 0.45


def sfx_chime(dur=0.7):
    n = int(dur * SR)
    a = sine(880, n) * env(n, 0.002, 0.7, 0, None, 1.8)
    b = sine(1320, n) * env(n, 0.002, 0.5, 0, None, 1.8) * 0.5
    c = sine(1760, n) * env(n, 0.002, 0.35, 0, None, 1.8) * 0.25
    return (a + b + c) * 0.42


def sfx_lock(dur=0.22):
    n = int(dur * SR)
    out = np.zeros(n)
    for i, f in enumerate((1180, 1580)):
        s = int(i * 0.09 * SR)
        m = int(0.07 * SR)
        out[s:s + m] += sine(f, m) * env(m, 0.002, 0.065)
    return out * 0.5


def sfx_shutter(dur=0.24):
    n = int(dur * SR)
    out = np.zeros(n)
    c1 = int(0.012 * SR)
    out[:c1] += bandpass(noise(c1), 1500, 7000) * env(c1, 0.0005, 0.011)
    s2 = int(0.055 * SR)
    c2 = int(0.02 * SR)
    out[s2:s2 + c2] += bandpass(noise(c2), 900, 5000) * env(c2, 0.0005, 0.019) * 0.8
    thump = sine(140, n, 80) * env(n, 0.001, 0.12) * 0.5
    return out * 0.9 + thump


def sfx_pulse(dur=0.16):
    n = int(dur * SR)
    return sine(520, n, 480) * env(n, 0.01, 0.15) * 0.3


LIB = {
    'air': sfx_air, 'pop': sfx_pop, 'thud': sfx_thud, 'whoosh': sfx_whoosh,
    'riser': sfx_riser, 'chime': sfx_chime, 'lock': sfx_lock, 'shutter': sfx_shutter, 'pulse': sfx_pulse,
}


def stereo(x, pan=0.0):
    l = x * math.cos((pan + 1) * math.pi / 4)
    r = x * math.sin((pan + 1) * math.pi / 4)
    return np.stack([l, r], axis=1)


def render_track(events, dur):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for e in events:
        kind = e['sfx']
        kwargs = {}
        if 'dur' in e:
            kwargs['dur'] = e['dur']
        x = LIB[kind](**kwargs) * e.get('gain', 1.0)
        s = int(e['t'] * SR)
        m = min(len(x), n - s)
        if m <= 0:
            continue
        out[s:s + m] += stereo(x[:m], e.get('pan', 0.0))
    return out


def limit(x, peak_db=-10.0):
    peak = 10 ** (peak_db / 20)
    m = np.abs(x).max()
    if m > peak:
        x = x * (peak / m)
    return np.tanh(x * 1.2) / 1.2  # gentle knee


def write_wav(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())


def mux(video, audio, out, bg=None):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = [FFMPEG, '-y', '-v', 'error', '-i', video, '-i', audio]
    if bg:
        # background audio file, ducked under the sound design
        cmd += ['-stream_loop', '-1', '-i', bg, '-filter_complex',
                '[2:a]volume=0.22,lowpass=f=9000[bg];[1:a][bg]sidechaincompress=threshold=0.05:ratio=6:attack=20:release=400[duck];'
                '[1:a][duck]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.9[a]',
                '-map', '0:v', '-map', '[a]']
    else:
        cmd += ['-map', '0:v', '-map', '1:a']
    cmd += ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]
    subprocess.run(cmd, check=True)


def main():
    bg = os.path.join(HERE, 'bg-audio.mp3')
    bg = bg if os.path.exists(bg) else None
    tracks = []
    names = PLAN['names']
    for slide in PLAN['slides']:
        sid = slide['id']
        x = limit(render_track(slide['events'], slide['duration']))
        tracks.append(x)
        wav = os.path.join(W, 'exports/audio', f'{sid}.wav')
        write_wav(wav, x)
        mux(os.path.join(W, 'exports/slides', f'{sid}.mp4'), wav, os.path.join(W, 'exports/final', names[sid] + '.mp4'), bg)
        print(f'{sid}: {len(slide["events"])} events → {names[sid]}.mp4' + (' (+ background audio)' if bg else ''))
    full = np.concatenate(tracks)
    wav = os.path.join(W, 'exports/audio', 'carousel.wav')
    write_wav(wav, full)
    mux(os.path.join(W, 'exports/carousel-preview.mp4'), wav, os.path.join(W, 'exports/final', names['preview'] + '.mp4'), bg)
    print('preview →', names['preview'] + '.mp4')


if __name__ == '__main__':
    main()
