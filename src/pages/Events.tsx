import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import eventImage from "@/assets/event-wellness.jpg";
import coachingImage from "@/assets/coaching-session.jpg";
import retreatImage from "@/assets/retreat-setting.jpg";

const categories = ["All", "Networking", "Workshop", "Retreat", "Coaching"];

const events = [
  {
    id: 1,
    title: "LoveHer: Galentine's Brunch",
    date: "February 28, 2026",
    time: "12:00PM - 16:00PM",
    location: "The Venue, Sandton, Johannesburg",
    price: "R350.00",
    spots: 40,
    spotsLeft: 12,
    image: eventImage,
    category: "Networking/Creative Workshop",
    description: "An intimate gathering celebrating sisterhood over gourmet brunch, featuring a guest speaker on holistic wellness and networking opportunities with like-minded women.",
    paymentLink: "https://pay.zapper.com/example",
  },
  {
    id: 2,
    title: "Transform & Thrive Workshop",
    date: "March 8, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Cape Town Convention Centre",
    price: "R650",
    spots: 80,
    spotsLeft: 35,
    image: coachingImage,
    category: "Workshop",
    description: "A full-day intensive workshop focused on personal transformation, goal setting, and creating actionable plans for the life you desire.",
    paymentLink: "https://pay.zapper.com/example",
  },
  {
    id: 3,
    title: "Weekend Wellness Retreat",
    date: "April 20-22, 2026",
    time: "Full Weekend",
    location: "Mountain Sanctuary, Drakensberg",
    price: "R3,500",
    spots: 25,
    spotsLeft: 8,
    image: retreatImage,
    category: "Retreat",
    description: "Escape to the mountains for a transformative weekend of yoga, meditation, journaling, and deep connection with fellow women on a journey of self-discovery.",
    paymentLink: "https://pay.zapper.com/example",
  },
  {
    id: 4,
    title: "Career Elevation Masterclass",
    date: "March 22, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "Virtual Event (Zoom)",
    price: "R350",
    spots: 100,
    spotsLeft: 67,
    image: coachingImage,
    category: "Workshop",
    description: "Learn strategies to advance your career, negotiate your worth, and build influence in your professional space from women who've done it.",
    paymentLink: "https://pay.zapper.com/example",
  },
  {
    id: 5,
    title: "Sunset Networking Soirée",
    date: "May 10, 2026",
    time: "5:00 PM - 8:00 PM",
    location: "Rooftop Garden, Rosebank",
    price: "R280",
    spots: 60,
    spotsLeft: 42,
    image: eventImage,
    category: "Networking",
    description: "Mix and mingle with ambitious women entrepreneurs and professionals in a beautiful rooftop setting as the sun sets over Johannesburg.",
    paymentLink: "https://pay.zapper.com/example",
  },
  {
    id: 6,
    title: "One-on-One Coaching Session",
    date: "Flexible Scheduling",
    time: "60 minutes",
    location: "Virtual or In-Person",
    price: "R800",
    spots: 0,
    spotsLeft: 0,
    image: coachingImage,
    category: "Coaching",
    description: "Personal coaching sessions tailored to your unique journey. Work with our certified coaches to break through barriers and design your ideal life.",
    paymentLink: "https://pay.zapper.com/example",
  },
];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = events.filter(
    (event) => activeCategory === "All" || event.category === activeCategory
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Transform Your Life
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              Upcoming <span className="text-primary italic">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us at one of our transformative gatherings designed to empower, 
              connect, and inspire women across South Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden group">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-square md:aspect-auto overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blush text-primary text-xs font-medium rounded-full mb-4">
                        {event.category}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        {event.title}
                      </h3>
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
                            <span>{event.spotsLeft} spots left</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <span className="font-display text-2xl font-semibold text-primary">
                        {event.price}
                      </span>
                      <Button variant="default" size="sm" asChild>
                        <a href={event.paymentLink} target="_blank" rel="noopener noreferrer">
                          Book Now <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No events found in this category. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Private Events CTA */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Planning a Corporate Event?
            </h2>
            <p className="text-muted-foreground mb-10">
              We offer customized wellness workshops and team-building experiences for 
              organizations looking to invest in their women employees' growth and wellbeing.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Enquire About Corporate Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
