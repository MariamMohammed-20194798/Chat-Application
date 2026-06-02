-- Row Level Security policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles (for friends list), update own
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Rooms: only participants can view
CREATE POLICY "Users can view rooms they participate in"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.room_participants rp
      WHERE rp.room_id = rooms.id AND rp.user_id = auth.uid()
    )
  );

-- Room participants
CREATE POLICY "Users can view participants in their rooms"
  ON public.room_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.room_participants rp
      WHERE rp.room_id = room_participants.room_id AND rp.user_id = auth.uid()
    )
  );

-- Messages: only room participants
CREATE POLICY "Users can view messages in their rooms"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.room_participants rp
      WHERE rp.room_id = messages.room_id AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their rooms"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = from_user_id
    AND EXISTS (
      SELECT 1 FROM public.room_participants rp
      WHERE rp.room_id = messages.room_id AND rp.user_id = auth.uid()
    )
  );

-- User presence
CREATE POLICY "Presence viewable by authenticated users"
  ON public.user_presence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can upsert own presence"
  ON public.user_presence FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role bypasses RLS (used by Express server)
