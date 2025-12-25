# Quick Fix: Table Not Found Error

If you're seeing this error:
```
Could not find the table 'public.leaderboard' in the schema cache
```

## Solution: Create the Table in Supabase

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Setup SQL**
   - Open the `supabase-setup.sql` file in this project
   - Copy ALL the SQL code
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl/Cmd + Enter)

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see `leaderboard` table listed
   - Click on it to see the structure

5. **Restart Your Dev Server**
   ```bash
   # Stop your current server (Ctrl+C)
   npm run dev
   ```

6. **Test Again**
   - Refresh your browser
   - The leaderboard should now work!

## Alternative: Use Table Editor (Simpler)

If you prefer a GUI:

1. Go to **Table Editor** → **New Table**
2. Name it: `leaderboard`
3. Add these columns:
   - `id` - Type: `int8` - Primary Key - Default: `auto increment`
   - `wallet_address` - Type: `text` - Unique: Yes - Nullable: No
   - `score` - Type: `int4` - Nullable: No
   - `created_at` - Type: `timestamptz` - Default: `now()`
   - `updated_at` - Type: `timestamptz` - Default: `now()`
4. Click "Save"
5. Go to **Authentication** → **Policies** → Select `leaderboard` table
6. Enable RLS (Row Level Security)
7. Add these policies:
   - Policy name: "Anyone can read"
     - Allowed operation: SELECT
     - USING expression: `true`
   - Policy name: "Anyone can insert"
     - Allowed operation: INSERT
     - WITH CHECK expression: `true`
   - Policy name: "Anyone can update"
     - Allowed operation: UPDATE
     - USING expression: `true`
     - WITH CHECK expression: `true`

