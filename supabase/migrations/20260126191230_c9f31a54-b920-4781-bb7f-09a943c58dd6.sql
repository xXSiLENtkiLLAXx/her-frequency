-- Create testimonials table for user-submitted reviews
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  location TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert testimonials (for submission)
CREATE POLICY "Anyone can submit a testimonial" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (true);

-- Only approved testimonials are publicly visible
CREATE POLICY "Approved testimonials are visible to everyone" 
ON public.testimonials 
FOR SELECT 
USING (is_approved = true);