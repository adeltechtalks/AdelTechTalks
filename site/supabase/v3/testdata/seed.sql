insert into auth.users (id,email,raw_user_meta_data) values
 ('11111111-1111-4111-8111-111111111111','adel@example.test','{"full_name":"Adel"}'::jsonb);
insert into public.progress (user_id,track_slug,step_index)
  select '11111111-1111-4111-8111-111111111111','ai-in-your-camera',g from generate_series(0,6) g;
insert into public.progress (user_id,track_slug,step_index)
  select '11111111-1111-4111-8111-111111111111','prompt-basics',g from generate_series(0,2) g;
insert into public.badges (user_id,track_slug) values
 ('11111111-1111-4111-8111-111111111111','ai-in-your-camera'),
 ('11111111-1111-4111-8111-111111111111','prompt-basics'),
 ('11111111-1111-4111-8111-111111111111','vibe-coding-intro');
insert into public.shares (id,user_id,track_slug,display_name,earned_at) values
 ('d8ad0f50-fb66-445e-8c1f-fc9960d08d78','11111111-1111-4111-8111-111111111111',
  'ai-in-your-camera','Adel','2026-08-04 14:24:38.543789+00');
insert into public.subscribers (email) values ('someone@example.test');
