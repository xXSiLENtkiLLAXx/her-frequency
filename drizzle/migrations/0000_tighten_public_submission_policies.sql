DROP POLICY IF EXISTS "Anyone can submit a registration" ON public.event_registrations;
DROP POLICY IF EXISTS "Anyone can submit a testimonial" ON public.testimonials;
CREATE POLICY "Anyone can submit unapproved testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (is_approved = false);