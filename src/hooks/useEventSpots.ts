import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEventSpots = (eventId: number, initialSpots: number) => {
  const [spotsLeft, setSpotsLeft] = useState(initialSpots);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpotsLeft = async () => {
    try {
      // Use secure RPC function to get count without exposing PII
      const { data, error } = await supabase
        .rpc('get_event_confirmed_count', { event_id_param: eventId });

      if (error) throw error;

      const confirmedCount = data || 0;
      setSpotsLeft(Math.max(0, initialSpots - confirmedCount));
    } catch (error) {
      console.error("Error fetching spots:", error);
      setSpotsLeft(initialSpots);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotsLeft();
  }, [eventId, initialSpots]);

  const refreshSpots = () => {
    fetchSpotsLeft();
  };

  return { spotsLeft, isLoading, refreshSpots };
};
