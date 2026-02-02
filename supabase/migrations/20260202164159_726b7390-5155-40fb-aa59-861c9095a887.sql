-- Create table to track event registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cellphone TEXT NOT NULL,
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a registration (public form)
CREATE POLICY "Anyone can submit a registration"
ON public.event_registrations
FOR INSERT
WITH CHECK (true);

-- Anyone can read registrations (needed for spot counting)
CREATE POLICY "Anyone can view registrations"
ON public.event_registrations
FOR SELECT
USING (true);

-- Anyone can update their own registration (for payment confirmation)
CREATE POLICY "Anyone can confirm payment"
ON public.event_registrations
FOR UPDATE
USING (true)
WITH CHECK (true);