begin;
  drop table public.shares;
  create view public.shares with (security_invoker = true) as
    select v.id, v.user_id,
           regexp_replace(v.subject_id,'^playground-','') as track_slug,
           v.display_name, v.earned_at
    from public.achievement_verifications v
    where v.subject_type='badge' and v.subject_id like 'playground-%' and v.revoked_at is null;
  grant select on public.shares to anon, authenticated;
  revoke insert, update, delete on public.shares from anon, authenticated;
commit;
