import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";

const categories = ["All", "Networking", "Workshop"];

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
              <EventCard key={event.id} event={event} />
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
