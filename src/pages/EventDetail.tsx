import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft, ExternalLink, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { getEventById } from "@/data/events";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(Number(id));

  if (!event) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
              Event Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="default" asChild>
              <Link to="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const showFullDetails = event.id === 1;

  return (
    <Layout>
      {/* Hero Section with Event Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container-custom mx-auto">
            <Button variant="ghost" size="sm" className="mb-4 text-foreground/80 hover:text-foreground" asChild>
              <Link to="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
            <span className="inline-block px-4 py-2 bg-blush text-primary text-sm font-medium rounded-full mb-4">
              <Tag className="inline h-3 w-3 mr-1" />
              {event.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  About This Event
                </h2>
                {showFullDetails ? (
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {event.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Details coming soon. Stay tuned for more information about this exciting event!
                  </p>
                )}
              </div>

              {showFullDetails && (
                <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    What to Expect
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Guided reflection and self-awareness exercises</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Meaningful conversations with like-minded women</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Intentional connection and networking opportunities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Delicious brunch and refreshments</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 sticky top-24 space-y-6">
                {showFullDetails ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-foreground">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{event.date}</p>
                          <p className="text-sm text-muted-foreground">Date</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{event.time}</p>
                          <p className="text-sm text-muted-foreground">Time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{event.location}</p>
                          <p className="text-sm text-muted-foreground">Venue</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-foreground">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{event.spotsLeft} spots left</p>
                          <p className="text-sm text-muted-foreground">of {event.spots} total</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Price</p>
                      <p className="font-display text-3xl font-semibold text-primary">
                        {event.price}
                      </p>
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <a href={event.paymentLink} target="_blank" rel="noopener noreferrer">
                        Book Now <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center py-4">
                      <p className="font-display text-3xl font-semibold text-primary mb-2">
                        {event.price}
                      </p>
                      <p className="text-muted-foreground">
                        Full details will be announced soon
                      </p>
                    </div>

                    <Button className="w-full" size="lg" variant="outline" asChild>
                      <Link to="/contact">
                        Get Notified
                      </Link>
                    </Button>
                  </>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Secure Payment via SnapScan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Events CTA */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Explore More Events
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover other transformative experiences designed to empower and inspire.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
