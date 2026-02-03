-- Add confirmation_token column to event_registrations
-- This token is generated when a registration is created and must be presented to confirm payment
ALTER TABLE public.event_registrations
ADD COLUMN confirmation_token text UNIQUE;

-- Add an index for faster token lookups
CREATE INDEX idx_event_registrations_token ON public.event_registrations(confirmation_token);

-- Add a comment explaining the purpose
COMMENT ON COLUMN public.event_registrations.confirmation_token IS 'Cryptographic token that must be presented to confirm payment. Generated on registration creation, sent in confirmation emails.';