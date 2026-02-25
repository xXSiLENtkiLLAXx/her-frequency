import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

export const useEventSpots = (eventId: number, initialSpots: number) => {
  const [spotsLeft, setSpotsLeft] = useState(initialSpots);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpotsLeft = async () => {
    try {
      // Fetch confirmed count and reserved spots in parallel
      const [countResult, settingsResult] = await Promise.all([
        supabase.rpc('get_event_confirmed_count', { event_id_param: eventId }),
        supabase.from('event_settings').select('total_spots, reserved_spots').eq('event_id', eventId).single(),
      ]);

      if (countResult.error) throw countResult.error;

      const confirmedCount = countResult.data || 0;
      const totalSpots = settingsResult.data?.total_spots ?? initialSpots;
      const reservedSpots = settingsResult.data?.reserved_spots ?? 0;

      setSpotsLeft(Math.max(0, totalSpots - confirmedCount - reservedSpots));
    } catch (error) {
      logger.error("Error fetching spots:", error);
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
