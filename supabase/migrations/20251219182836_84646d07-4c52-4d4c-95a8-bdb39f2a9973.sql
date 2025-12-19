-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  highest_roll BIGINT DEFAULT 0,
  total_rolls BIGINT DEFAULT 0,
  prestige_count INTEGER DEFAULT 0,
  void_points INTEGER DEFAULT 0,
  currency BIGINT DEFAULT 0,
  upgrade_levels JSONB DEFAULT '{"permanent_luck": 0, "auto_roll_speed": 0, "max_potion_stacks": 0, "potion_duration": 0, "super_roll_chance": 0}'::jsonb,
  void_upgrades JSONB DEFAULT '{"super_roll_boost": 0, "void_potion_power": 0, "void_potion_duration": 0}'::jsonb,
  unlocked_achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create leaderboard view
CREATE VIEW public.leaderboard AS
SELECT username, highest_roll, prestige_count, void_points
FROM public.profiles
ORDER BY highest_roll DESC
LIMIT 100;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;