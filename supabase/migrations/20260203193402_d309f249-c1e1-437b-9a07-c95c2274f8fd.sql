-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create event_settings table to store configurable event data
CREATE TABLE public.event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id integer UNIQUE NOT NULL,
  event_name text NOT NULL,
  total_spots integer NOT NULL DEFAULT 50,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for calculating available spots
CREATE POLICY "Anyone can view event settings"
ON public.event_settings
FOR SELECT
USING (true);

-- Insert default settings for existing events
INSERT INTO public.event_settings (event_id, event_name, total_spots)
VALUES 
  (1, 'LoveHer: Galentines Brunch', 50),
  (2, 'HealHer: Wellness Retreat', 30),
  (3, 'AwakenHer: Spiritual Workshop', 40);

-- Create trigger for updated_at
CREATE TRIGGER update_event_settings_updated_at
BEFORE UPDATE ON public.event_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();