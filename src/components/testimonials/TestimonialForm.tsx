import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const TestimonialForm = () => {
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

      toast.success("Thank you! Your testimonial has been submitted for review.");
      setFormData({ name: "", role: "", location: "", quote: "" });
      setRating(0);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-center">
          Share Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
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
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="e.g., N M"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              maxLength={100}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Your Role (optional)</Label>
            <Input
              id="role"
              placeholder="e.g., Entrepreneur, Mom, Creative Director"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              maxLength={100}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Your Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Johannesburg, Cape Town"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              maxLength={100}
            />
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label htmlFor="quote">Your Experience *</Label>
            <Textarea
              id="quote"
              placeholder="Tell us about your experience with Her Frequency..."
              value={formData.quote}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quote: e.target.value }))
              }
              rows={5}
              maxLength={1000}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Your Testimonial"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Your testimonial will be reviewed before being published.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
