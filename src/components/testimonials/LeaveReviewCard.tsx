import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { checkRateLimit, recordAttempt, rateLimiters } from "@/lib/rateLimiter";

interface LeaveReviewCardProps {
  compact?: boolean;
}

export const LeaveReviewCard = ({ compact = false }: LeaveReviewCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    quote: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit before proceeding
    const { allowed, secondsRemaining } = checkRateLimit(rateLimiters.testimonial);
    if (!allowed) {
      const minutes = Math.ceil(secondsRemaining / 60);
      toast.error(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before submitting another review.`);
      return;
    }

    if (!formData.name.trim() || !formData.quote.trim() || rating === 0) {
      toast.error("Please fill in your name, review, and rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("testimonials").insert({
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        location: formData.location.trim() || null,
        quote: formData.quote.trim(),
        rating,
      });

      if (error) throw error;

      // Record successful submission for rate limiting
      recordAttempt(rateLimiters.testimonial.key, rateLimiters.testimonial.windowMs);
      
      toast.success("Thank you! Your review has been submitted.");
      setFormData({ name: "", role: "", location: "", quote: "" });
      setRating(0);
    } catch (error) {
      logger.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`${compact ? "p-6" : "p-8"} bg-gradient-to-br from-blush/50 to-powder-blue/30 border-primary/20`}>
      <CardContent className="pt-0">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Leave a Review ✨
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <Input
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            maxLength={100}
            className="bg-background/80"
          />

          {/* Role & Location - side by side on larger screens */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Your Role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              maxLength={100}
              className="bg-background/80"
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              maxLength={100}
              className="bg-background/80"
            />
          </div>

          {/* Review */}
          <Textarea
            placeholder="Share your experience... *"
            value={formData.quote}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quote: e.target.value }))
            }
            rows={3}
            maxLength={500}
            className="resize-none bg-background/80"
          />

          <Button
            type="submit"
            variant="hero"
            size="sm"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
