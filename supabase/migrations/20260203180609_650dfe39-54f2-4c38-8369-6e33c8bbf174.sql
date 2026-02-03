-- Add input validation to the get_event_confirmed_count function
-- This prevents abuse with invalid event IDs (NULL, negative, extremely large values)

CREATE OR REPLACE FUNCTION public.get_event_confirmed_count(event_id_param INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
RETURNS NULL ON NULL INPUT
AS $$
DECLARE
  confirmed_count INTEGER;
BEGIN
  -- Validate input: must be a positive integer
  IF event_id_param <= 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO confirmed_count
  FROM public.event_registrations
  WHERE event_id = event_id_param
    AND payment_confirmed = true;
  
  RETURN confirmed_count;
END;
$$;