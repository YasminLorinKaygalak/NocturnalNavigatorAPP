-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  dreamScore INT,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create the Dream table
CREATE TABLE Dream (
    username VARCHAR(50),
    time text NOT NULL,
    date text NOT NULL,
    input TEXT NOT NULL,
    output text not null,
    theme VARCHAR(100),
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Assuming rating is between 1 and 5
    PRIMARY KEY (username, time, date), -- Compound key
    FOREIGN KEY (username) REFERENCES profiles(username)
);


-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a trigger function
CREATE OR REPLACE FUNCTION log_dream_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Insert a log entry into a 'dream_logs' table
  -- You must have a 'dream_logs' table created beforehand
  INSERT INTO Dream (username, input, output, date, time)
  VALUES (
    new.username, new.input, new.output, new.date, new.time             -- The action performed
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function after an INSERT operation on the Dream table
CREATE TRIGGER dream_insert_trigger
AFTER INSERT ON Dream
FOR EACH ROW
EXECUTE procedure log_dream_changes();


-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');

create policy "Users can insert their dreams" on Dream
for insert
with check (
  username = (select username from profiles where id = auth.uid())
);

ALTER TABLE Dream DISABLE ROW LEVEL SECURITY;

create policy "Users can update their own dreams" on Dream
for update
using (username = auth.uid());

create policy "Users can delete their own dreams" on Dream
for delete
using (username = auth.uid());
