-- Drop the security definer view and recreate as regular view
DROP VIEW IF EXISTS public.leaderboard;

-- Create leaderboard as a simple view without security definer
CREATE OR REPLACE VIEW public.leaderboard WITH (security_invoker = true) AS
SELECT username, highest_roll, prestige_count, void_points
FROM public.profiles
ORDER BY highest_roll DESC
LIMIT 100;