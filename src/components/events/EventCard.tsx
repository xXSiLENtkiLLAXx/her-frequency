import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEventSpots } from "@/hooks/useEventSpots";
import type { Event } from "@/data/events";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { spotsLeft, isLoading } = useEventSpots(event.id, event.spots);
  const showFullDetails = event.id === 1;

  return (
    <Card className="overflow-hidden group">
      <div className="grid md:grid-cols-2-[260px_1fr]">
        <div className="overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex flex-col">
          <div>
            <span className="inline-block px-3 py-1 bg-blush text-primary text-xs font-medium rounded-full mb-4">
              {event.category}
            </span>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
              {event.title}
            </h3>
            {showFullDetails && (
              <>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  {event.spots > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {isLoading ? "..." : spotsLeft} spots left
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border gap-2">
            <span className="font-display text-xl font-semibold text-primary">
              {event.price}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/events/${event.id}`}>Learn More</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to={`/events/${event.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
