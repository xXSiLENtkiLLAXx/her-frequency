import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  quote: string;
  rating: number;
  created_at: string;
  is_approved?: boolean;
}

export const useTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: ["testimonials", limit],
    queryFn: async (): Promise<Testimonial[]> => {
      // Only fetch testimonials that are approved
      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true) // <-- only approved testimonials
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error("Error fetching testimonials:", error);
        throw error;
      }

      return data || [];
    },
  });
};
