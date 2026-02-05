-- Add reserved_spots column to allow manual adjustment of available spots
-- spots_left = total_spots - confirmed_count - reserved_spots
ALTER TABLE public.event_settings 
ADD COLUMN reserved_spots integer NOT NULL DEFAULT 0;