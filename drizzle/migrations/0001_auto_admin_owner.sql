create or replace function public.novalestic_grant_owner_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'arslankalri@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id) do update set role = 'admin';
  end if;
  return new;
end;
$$;

revoke all on function public.novalestic_grant_owner_admin() from public, anon, authenticated;

drop trigger if exists novalestic_on_owner_created on auth.users;
create trigger novalestic_on_owner_created
after insert on auth.users
for each row execute function public.novalestic_grant_owner_admin();

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'arslankalri@gmail.com'
on conflict (user_id) do update set role = 'admin';