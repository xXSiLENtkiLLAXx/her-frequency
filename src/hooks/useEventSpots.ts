import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEventSpots = (eventId: number, initialSpots: number) => {
  const [spotsLeft, setSpotsLeft] = useState(initialSpots);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpotsLeft = async () => {
    try {
      const { count, error } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("payment_confirmed", true);

      if (error) throw error;

      const confirmedCount = count || 0;
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
