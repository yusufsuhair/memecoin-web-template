# Supabase Leaderboard Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `memecoin-leaderboard` (or any name you prefer)
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project" and wait for it to be set up

## 2. Create the Leaderboard Table

Once your project is ready:

1. Go to the **SQL Editor** in your Supabase dashboard (left sidebar)
2. Click **"New query"** button
3. You can either:
   - **Option A**: Copy and paste the SQL from `supabase-setup.sql` file in this project
   - **Option B**: Copy the SQL below:

```sql
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
```

4. Click **"Run"** button (or press Ctrl/Cmd + Enter) to execute the SQL
5. You should see a success message: "Success. No rows returned"
6. Verify the table was created:
   - Go to **Table Editor** in the left sidebar
   - You should see the `leaderboard` table listed

## 3. Get Your API Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon" → "public")

## 4. Configure Environment Variables

Update your `.env.local` file with the credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your actual anon key

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Connect your wallet in the app
3. Play the game and get a score
4. Check if your score appears in the leaderboard

## Troubleshooting

### Error: "Failed to fetch leaderboard"
- Check that your Supabase URL and key are correct in `.env.local`
- Make sure the table was created successfully
- Check the browser console for specific error messages

### Error: "Failed to submit score"
- Verify that RLS policies are set up correctly
- Check that `wallet_address` is a valid Solana address
- Ensure the `score` is a positive integer

### Scores not showing up
- Check the Supabase dashboard → Table Editor → leaderboard
- Verify that data is being inserted
- Check the browser network tab for API response errors

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add the same environment variables in your hosting platform
2. Vercel: Go to Project Settings → Environment Variables
3. Add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

