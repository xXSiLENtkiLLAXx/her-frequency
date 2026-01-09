import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote: "Her Frequency gave me the courage to step into my power. The sisterhood I found here is unmatched. Every event leaves me feeling renewed and inspired.",
    author: "Nomvula Mokwena",
    role: "Entrepreneur",
    location: "Johannesburg",
  },
  {
    quote: "The Transform & Thrive workshop changed my entire perspective on goal-setting. I left with a clear vision and actionable steps. Six months later, I've achieved more than I did in the previous three years.",
    author: "Sarah Kruger",
    role: "Creative Director",
    location: "Cape Town",
  },
  {
    quote: "The coaching sessions transformed not just my mindset, but my entire life trajectory. My coach helped me see possibilities I didn't know existed. Forever grateful for this community.",
    author: "Thembi Nkosi",
    role: "Corporate Executive",
    location: "Durban",
  },
  {
    quote: "As a mother of three, I rarely prioritize myself. The wellness retreat was a gift I didn't know I needed. I came home a better version of myself, for me and my family.",
    author: "Priya Naidoo",
    role: "Full-time Mom",
    location: "Pretoria",
  },
  {
    quote: "I was skeptical at first - another women's event, right? But this was different. Genuine connections, real conversations, and tools I still use daily. This is the real deal.",
    author: "Lindiwe Dlamini",
    role: "Startup Founder",
    location: "Johannesburg",
  },
  {
    quote: "The networking soirée connected me with my now business partner. Beyond that, I've made lifelong friends. Her Frequency isn't just events - it's a movement.",
    author: "Michelle Adams",
    role: "Marketing Consultant",
    location: "Cape Town",
  },
  {
    quote: "My coach helped me navigate a difficult career transition with grace and confidence. I'm now in my dream role, and I credit this community for helping me believe it was possible.",
    author: "Zinhle Mthembu",
    role: "Tech Lead",
    location: "Sandton",
  },
  {
    quote: "The retreat in the Drakensberg was magical. The combination of nature, sisterhood, and inner work created a transformation I didn't expect. Already booked for the next one!",
    author: "Fatima Patel",
    role: "Wellness Coach",
    location: "Johannesburg",
  },
];

const Testimonials = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Real Stories
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              Voices of <span className="text-primary italic">Sisterhood</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Hear from the incredible women who've experienced transformation 
              through our events, coaching, and community.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 relative">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-foreground text-lg leading-relaxed mb-8 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blush flex items-center justify-center">
                      <span className="font-display text-lg font-semibold text-primary">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Ready to Write Your Story?
            </h2>
            <p className="text-muted-foreground mb-10">
              Join our community and start your transformation journey today. 
              Your story could be the next one we share.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/events">Join an Event</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
