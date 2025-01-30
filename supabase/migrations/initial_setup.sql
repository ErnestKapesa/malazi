-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create profiles table if not exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role user_role not null default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create boarding houses table if not exists
create table if not exists public.boarding_houses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users not null,
  name text not null,
  description text,
  address text not null,
  price_per_month decimal not null,
  available_rooms integer not null,
  amenities text[] default '{}',
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table if not exists
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.boarding_houses enable row level security;
alter table public.messages enable row level security;

-- Create basic policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Anyone can view boarding houses"
  on boarding_houses for select
  using (true);

create policy "Owners can manage their properties"
  on boarding_houses for all
  using (auth.uid() = owner_id);

create policy "Users can view their messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on messages for insert
  with check (auth.uid() = sender_id); 