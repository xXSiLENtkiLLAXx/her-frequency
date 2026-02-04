-- Add SELECT policy that denies public access to event_registrations
-- All legitimate access goes through:
-- 1. Admin edge function (uses service role, bypasses RLS)
-- 2. get_event_confirmed_count RPC (uses SECURITY DEFINER, bypasses RLS)
-- 3. confirm-payment edge function (uses service role, bypasses RLS)

CREATE POLICY "No public SELECT access to registrations"
ON public.event_registrations
FOR SELECT
USING (false);