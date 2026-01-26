import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  location?: string;
  rating: number;
  compact?: boolean;
}

export const TestimonialCard = ({
  quote,
  author,
  role,
  location,
  rating,
  compact = false,
}: TestimonialCardProps) => {
  return (
    <Card className={compact ? "p-6" : "p-8"} >
      <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />
      <CardContent className="pt-0 relative">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating
                  ? "text-primary fill-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <p className={`text-foreground leading-relaxed mb-6 italic ${compact ? "text-base" : "text-lg"}`}>
          "{quote}"
        </p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blush flex items-center justify-center">
            <span className="font-display text-lg font-semibold text-primary">
              {author.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">
              {author}
            </p>
            {(role || location) && (
              <p className="text-sm text-muted-foreground">
                {[role, location].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
