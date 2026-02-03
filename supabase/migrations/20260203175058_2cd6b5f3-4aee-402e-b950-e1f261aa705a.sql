-- Drop the insecure UPDATE policy that allows anyone to confirm payments
DROP POLICY IF EXISTS "Users can confirm their own payment" ON public.event_registrations;

-- No client-side UPDATE policy - payments can only be confirmed via edge function with service role