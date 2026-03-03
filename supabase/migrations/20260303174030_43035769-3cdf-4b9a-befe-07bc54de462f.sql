
-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Allow public read access to gallery files
CREATE POLICY "Gallery files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

-- Only admins can upload/delete gallery files (via edge function with service role)
-- No direct upload policies needed since we'll use service role in edge function

-- Create gallery items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folder TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Gallery items are publicly viewable"
ON public.gallery_items
FOR SELECT
USING (true);
