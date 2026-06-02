-- Chat Application: PostgreSQL schema for Supabase
-- Run in Supabase SQL Editor or via supabase db push

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dwjot1zhy/image/upload/v1698150265/cqwmda1eys6hbf8wlcvo.jpg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Rooms (conversations)
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Room participants (many-to-many)
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user ON public.room_participants(user_id);

-- Messages (normalized from embedded MongoDB subdocs)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room_created ON public.messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_from ON public.messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to ON public.messages(to_user_id);

-- User presence (optional persistence; Socket.IO still uses in-memory set)
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, photo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'photo',
      'https://res.cloudinary.com/dwjot1zhy/image/upload/v1698150265/cqwmda1eys6hbf8wlcvo.jpg'
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for profiles and rooms
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Find or create a 1:1 room between two users
CREATE OR REPLACE FUNCTION public.find_or_create_room(user_a UUID, user_b UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_room_id UUID;
  created_flag BOOLEAN := FALSE;
BEGIN
  IF user_a = user_b THEN
    RAISE EXCEPTION 'Cannot create a room with yourself';
  END IF;

  SELECT rp1.room_id INTO found_room_id
  FROM public.room_participants rp1
  INNER JOIN public.room_participants rp2 ON rp1.room_id = rp2.room_id
  WHERE rp1.user_id = user_a AND rp2.user_id = user_b
  GROUP BY rp1.room_id
  HAVING COUNT(DISTINCT rp1.user_id) = 2
    AND (SELECT COUNT(*) FROM public.room_participants WHERE room_id = rp1.room_id) = 2
  LIMIT 1;

  IF found_room_id IS NULL THEN
    INSERT INTO public.rooms DEFAULT VALUES RETURNING id INTO found_room_id;
    INSERT INTO public.room_participants (room_id, user_id) VALUES (found_room_id, user_a);
    INSERT INTO public.room_participants (room_id, user_id) VALUES (found_room_id, user_b);
    created_flag := TRUE;
  END IF;

  RETURN jsonb_build_object('room_id', found_room_id, 'created', created_flag);
END;
$$;

-- Enable Realtime for messages (optional client subscriptions)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
