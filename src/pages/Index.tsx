import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Star, Calendar, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-sisterhood.jpg";
import eventImage from "@/assets/event-wellness.jpg";
import coachingImage from "@/assets/coaching-session.jpg";
import retreatImage from "@/assets/retreat-setting.jpg";
const values = [{
  icon: Heart,
  title: "Empowerment",
  description: "Lifting each other to reach our highest potential"
}, {
  icon: Sparkles,
  title: "Authenticity",
  description: "Embracing our true selves without apology"
}, {
  icon: Users,
  title: "Sisterhood",
  description: "Building a community of support and love"
}];
const upcomingEvents = [{
  id: 1,
  title: "LoveHer: Galentine's Brunch",
  date: "February 28, 2026",
  location: "Johannesburg",
  price: "R350.00",
  image: eventImage,
  category: "Networking/Creative Workshop"
}, {
  id: 2,
  title: "HealHer: Transform & Thrive Workshop",
  date: "March 28, 2026",
  location: "Cape Town",
  price: "R350.00",
  image: coachingImage,
  category: "Workshop"
}, {
  id: 3,
  title: "AwakenHer: Journey To Self Discovery",
  date: "April 25, 2026",
  location: "Drakensberg",
  price: "R350.00",
  image: retreatImage,
  category: "Networking/Creative Workshop"
}];
const testimonials = [{
  quote: "Her Frequency gave me the courage to step into my power. The sisterhood I found here is unmatched.",
  author: "Nomvula M.",
  role: "Entrepreneur"
}, {
  quote: "Every event leaves me feeling renewed, inspired, and more connected to myself and other incredible women.",
  author: "Sarah K.",
  role: "Creative Director"
}, {
  quote: "The coaching sessions transformed not just my mindset, but my entire life trajectory. Forever grateful.",
  author: "Thembi N.",
  role: "Corporate Executive"
}];
const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Women supporting each other" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom mx-auto px-4 md:px-8 py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6 animate-fade-up">
              Women's Empowerment & Wellness
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6 animate-fade-up delay-100">
              Becoming <span className="text-primary italic">HER</span>
              <br />
              One Day at a Time
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 animate-fade-up delay-200">
              Join a community of powerful women transforming their lives through events, 
              workshops, coaching, and genuine sisterhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-soft">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Foundation</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
              Built on Love, Growth & Authenticity
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => <Card key={value.title} className="text-center p-8 bg-card/80 backdrop-blur-sm border-none">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blush mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">What's Next</span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
                Upcoming Events
              </h2>
            </div>
            <Button variant="outline" className="mt-6 md:mt-0" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map(event => <Card key={event.id} className="overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <CardContent className="p-6">
                  <span className="inline-block px-3 py-1 bg-blush text-primary text-xs font-medium rounded-full mb-4">
                    {event.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-primary">
                      {event.price}
                    </span>
                    <Button variant="soft" size="sm" asChild>
                      <Link to={`/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Voices of Sisterhood</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
              What Our Community Says
            </h2>
          </div>

          

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/testimonials">Read More Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blush/30 to-powder-blue/20" />
        <div className="container-custom mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-6">
              Ready to Step Into Your Power?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of women who are transforming their lives through our events, 
              workshops, and coaching programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/events">
                  Browse Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="elegant" size="lg" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;