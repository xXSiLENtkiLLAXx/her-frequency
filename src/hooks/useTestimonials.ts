import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  quote: string;
  rating: number;
  created_at: string;
}

export const useTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: ["testimonials", limit],
    queryFn: async (): Promise<Testimonial[]> => {
      let query = supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }

      return data || [];
    },
  });
};
