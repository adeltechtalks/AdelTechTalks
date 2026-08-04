# Getting your website live — step by step

Written for someone who has never built a website. Follow the steps in order.
Nothing here requires you to write code.

**Time:** about 45 minutes for steps 1–4, which is everything needed to be live.
**Cost:** $0. You already own the domain.

---

## The order things happen in

Your site goes live and working **before** you touch your domain or your email.
Nothing risky happens until you have already seen it working.

| # | Where | What |
|---|---|---|
| 1 | GitHub | Create account, put the files there |
| 2 | Cloudflare | Create account |
| 3 | Cloudflare | Build the site → **it is live on a free address** ✅ |
| 4a–b | Cloudflare | Add your domain, **check the email records** 🛑 |
| 4c | **GoDaddy** | Change the nameservers |
| 4d | — | Wait for it to take effect |
| 4e | Cloudflare | Attach `adeltechtalks.com` to the site ✅ |

**GoDaddy is one single step (4c).** Everything else is Cloudflare.

---

## What you are actually doing

Your website is a folder of files. To put it on the internet you need three things:

| # | Thing | What it does | Cost |
|---|---|---|---|
| 1 | **GitHub** | Stores the files. Like Google Drive, but for websites. | Free |
| 2 | **Cloudflare Pages** | Reads the files from GitHub and serves them to visitors. Rebuilds automatically whenever anything changes. | Free |
| 3 | **Your domain** | The name people type. You already have this. | Already paid |

You do **not** need a server, a hosting plan, WordPress, or a website builder.

---

## Step 1 — Create a GitHub account

1. Go to **https://github.com/signup**
2. Sign up with your email. Choose the **free** plan.
3. Verify your email address.

That's it. You will not need to learn Git — everything happens through buttons on
the website.

---

## Step 2 — Put your site on GitHub

Ask me (Claude) to do this for you — say **"push the site to GitHub"** and I will
create the repository and upload everything.

If you would rather do it by hand:

1. On GitHub, click **+** (top right) → **New repository**
2. Name it `adeltechtalks-site`
3. Choose **Private** (nobody can see your files; the live site is still public)
4. Click **Create repository**
5. On the next screen click **uploading an existing file**
6. Drag in the whole `site` folder from your computer
7. Click **Commit changes**

> ⚠️ Do **not** upload the `node_modules` or `dist` folders. They are rebuilt
> automatically and are far too big. The included `.gitignore` file already tells
> GitHub to skip them.

---

## Step 3 — Connect Cloudflare Pages

1. Go to **https://dash.cloudflare.com/sign-up** and create a free account
2. In the left menu choose **Workers & Pages** → **Create** → **Pages** tab →
   **Connect to Git**
3. Authorise Cloudflare to read your GitHub, and pick `adeltechtalks-site`
4. On the build settings screen, enter **exactly** this:

   | Field | Value |
   |---|---|
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `site` |

5. Click **Save and Deploy**

Wait about two minutes. Cloudflare gives you a working address like
`adeltechtalks-site.pages.dev`. **Open it — your site is live on the internet.**

---

## Step 4 — Move your DNS to Cloudflare

> ### ⚠️ Read this first
>
> `adeltechtalks.com` currently has **live email on Microsoft 365**. Your DNS
> settings control your email as well as your website. If you move DNS to
> Cloudflare and the email records do not come across, **your email stops working.**
>
> This step is routine and thousands of people do it every day — but do not rush
> it, and do not skip the check in 4b.

**Your domain as it stands today** (checked 4 August 2026) — this is your backup.
If anything ever goes wrong, these are the values to restore:

| Type | Name | Value |
|---|---|---|
| NS | `adeltechtalks.com` | `ns47.domaincontrol.com` |
| NS | `adeltechtalks.com` | `ns48.domaincontrol.com` |
| MX | `adeltechtalks.com` | `adeltechtalks-com.mail.protection.outlook.com` (priority 0) |
| TXT | `adeltechtalks.com` | `v=spf1 include:secureserver.net -all` |
| TXT | `adeltechtalks.com` | `NETORGFT20744138.onmicrosoft.com` |
| A | `adeltechtalks.com` | `13.248.243.5` and `76.223.105.230` |
| CNAME | `www` | points to the bare domain |

### 4a. Add the domain to Cloudflare — **at Cloudflare**

1. In Cloudflare, click **Add a domain** (top of the dashboard)
2. Type `adeltechtalks.com`
3. Choose the **Free** plan
4. Cloudflare scans GoDaddy and shows you every record it found

### 4b. Check the email records — **at Cloudflare** 🛑

**Do not continue until you have done this.** On the list Cloudflare just showed
you, confirm all of these are present:

- [ ] **MX** → `adeltechtalks-com.mail.protection.outlook.com`
- [ ] **TXT** → `v=spf1 include:secureserver.net -all`
- [ ] **TXT** → `NETORGFT20744138.onmicrosoft.com`
- [ ] any record whose name starts with `autodiscover` or `_domainconnect`

Anything missing, add it by hand with **Add record**, copying from the backup table
above. If you are unsure, stop and ask me — this is the one step worth pausing on.

### 4c. Change the nameservers — **at GoDaddy**

Cloudflare now gives you **two nameservers** (something like `zoe.ns.cloudflare.com`
and `rick.ns.cloudflare.com` — everyone gets a different pair, use yours).

1. Sign in at **https://godaddy.com** → **My Products**
2. Find `adeltechtalks.com` → **Domain** → **Manage DNS**
3. Scroll to **Nameservers** → **Change Nameservers**
4. Choose **I'll use my own nameservers** (wording varies: "Custom")
5. Delete `ns47.domaincontrol.com` and `ns48.domaincontrol.com`, and enter the two
   Cloudflare gave you
6. Save. GoDaddy will warn you that this changes your services — that is expected.

### 4d. Wait

Cloudflare emails you when the change is picked up — usually under an hour, and up
to 24 hours. Your website and email keep running on the old settings until it
completes, so there is no gap.

**Check your email still works** once Cloudflare says the domain is active. Send
yourself a message from an outside address.

### 4e. Attach the domain to your site — **at Cloudflare**

1. **Workers & Pages** → your `adeltechtalks-site` project → **Custom domains**
2. **Set up a custom domain** → enter `adeltechtalks.com` → **Activate**
3. Repeat for `www.adeltechtalks.com`

Cloudflare adds the records itself. Within a few minutes `https://adeltechtalks.com`
serves your new site, with an HTTPS certificate issued automatically.

> The two old `A` records (`13.248.243.5`, `76.223.105.230`) pointed at whatever was
> on the domain before. Once your Pages site is attached, they are replaced. If you
> had a site there you want to keep, save a copy before this step.

Then edit **one line** in `src/site.config.ts` and in `astro.config.mjs`: change
`https://adeltechtalks.com` to your real domain. This is only used for the sitemap
and share links — the site works without it.

**At this point you are live and finished.** Steps 5–7 add the extra features.

---

## Step 5 — The brand enquiry form (5 minutes)

Right now the contact page shows your email address instead of a form.

1. Go to **https://formspree.io** and sign up (free plan: 50 submissions/month)
2. Create a new form, call it "Brand enquiries"
3. Formspree gives you an ID that looks like `xayzbwqd`
4. Open `src/site.config.ts`, find `formspreeId: ''` and put the ID between the
   quotes: `formspreeId: 'xayzbwqd'`

Enquiries now arrive in your email.

---

## Step 6 — The newsletter (10 minutes)

1. Pick one and sign up — all have free tiers:
   - **Kit** (kit.com) — best for creators, free to 10,000 subscribers
   - **Beehiiv** (beehiiv.com) — good analytics, free to 2,500
   - **Buttondown** (buttondown.com) — simplest, free to 100
2. Create a signup form in their dashboard
3. Find the form's **action URL** — it looks like
   `https://app.kit.com/forms/1234567/subscriptions`
4. Open `src/site.config.ts`, find `newsletterAction: ''` and paste it between the quotes

The signup boxes on the site start working immediately.

---

## Step 7 — The Playground: Google sign-in and badges (30 minutes)

This is the only genuinely technical step. Take it slowly — nothing here can break
the rest of your site.

### 7a. Create the database

1. Go to **https://supabase.com** and sign up (free)
2. Click **New project**. Name it `adeltechtalks`, pick a region near your audience
   (US East is a good default), and let it generate a database password. **Save that
   password somewhere safe.**
3. Wait about two minutes while it sets up

### 7b. Create the tables

1. In Supabase, click **SQL Editor** in the left menu → **New query**
2. Open the file `supabase/schema.sql` from your site folder
3. Copy everything in it, paste it into the box, click **Run**

You should see "Success. No rows returned." That is correct.

### 7c. Turn on Google sign-in

1. In Supabase: **Authentication** → **Sign In / Providers** → **Google** → toggle it on
2. It asks for a *Client ID* and *Client Secret*. To get them:
   - Go to **https://console.cloud.google.com**
   - Create a project (any name)
   - Search for "Credentials" → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Under **Authorised redirect URIs**, paste the callback URL that Supabase shows
     you on the Google provider screen (it ends in `/auth/v1/callback`)
   - Google gives you the Client ID and Secret — paste both into Supabase and save
3. Still in Supabase: **Authentication** → **URL Configuration** → set **Site URL**
   to your real domain (e.g. `https://adeltechtalks.com`)

### 7d. Connect it to the site

1. In Supabase: **Project Settings** → **API**
2. Copy the **Project URL** and the **anon public** key
3. Open `src/site.config.ts` and paste them in:
   ```
   supabaseUrl: 'https://xxxxx.supabase.co',
   supabaseAnonKey: 'eyJhbGci...',
   ```

Sign-in and badges are now live.

> **Is it safe to put that key in the website?** Yes. The `anon` key is designed to
> be public. What protects your data is the security rules in `schema.sql`, which
> make each person's progress readable and writable only by them. Never paste the
> **service_role** key into the site — that one is a master key and must stay secret.

---

## Making changes later

**The easy way:** ask me. "Add a new guide about X", "change the hero headline",
"add these three videos". I edit the files and push.

**By hand:** everything you would normally want to change lives in one file,
`src/site.config.ts` — your bio, pillars, videos, packages, Playground tracks.
Edit it on GitHub in the browser (click the file → pencil icon → **Commit changes**)
and Cloudflare rebuilds the site within a minute.

**Adding a guide:** copy any file in `src/content/guides/`, rename it, and change the
text. It appears on the site automatically.

---

## What is still placeholder

Search the project for the word `PLACEHOLDER` — these need your real content:

- `src/site.config.ts` → the three featured videos are fake YouTube IDs
- `src/site.config.ts` → your About page story (three paragraphs)
- `src/content/guides/first-workflow.md` → a sample guide
- `src/site.config.ts` → check the social links point at your real accounts
- `src/site.config.ts` → `email` is set to `hello@adeltechtalks.com`

The nine partnership packages came from your Playbook and are real, but the
deliverables and timelines are my drafts — read them before a brand does.
