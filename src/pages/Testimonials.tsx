import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { LeaveReviewCard } from "@/components/testimonials/LeaveReviewCard";
import { useTestimonials } from "@/hooks/useTestimonials";

const Testimonials = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();

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
              through our events and community.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid with Leave Review Card */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-card/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Leave a Review Card - First position */}
              <LeaveReviewCard />
              
              {/* All testimonials */}
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  quote={testimonial.quote}
                  author={testimonial.name}
                  role={testimonial.role || undefined}
                  location={testimonial.location || undefined}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          )}
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
