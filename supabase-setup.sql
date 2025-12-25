-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id BIGSERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet ON public.leaderboard(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON public.leaderboard;
DROP POLICY IF EXISTS "Anyone can insert scores" ON public.leaderboard;
DROP POLICY IF EXISTS "Anyone can update scores" ON public.leaderboard;

-- Create policy to allow anyone to read leaderboard
CREATE POLICY "Anyone can read leaderboard"
  ON public.leaderboard
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert scores
CREATE POLICY "Anyone can insert scores"
  ON public.leaderboard
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to update scores
CREATE POLICY "Anyone can update scores"
  ON public.leaderboard
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

