-- Add database-level length constraints to testimonials table
-- This prevents oversized inputs via direct API calls that bypass client-side validation

ALTER TABLE public.testimonials 
  ADD CONSTRAINT testimonials_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT testimonials_role_length CHECK (role IS NULL OR char_length(role) <= 100),
  ADD CONSTRAINT testimonials_location_length CHECK (location IS NULL OR char_length(location) <= 100),
  ADD CONSTRAINT testimonials_quote_length CHECK (char_length(quote) <= 1000);