import { Link } from "react-router-dom";
import { Sparkles, Users, Heart, Flower2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import coachingImage from "@/assets/coaching-session.jpg";
import retreatImage from "@/assets/retreat-setting.jpg";
import eventImage from "@/assets/event-wellness.jpg";

const services = [
  {
    id: "coaching",
    title: "1-on-1 Coaching",
    icon: Sparkles,
    description: "Personal transformation coaching tailored to your unique journey",
    image: coachingImage,
    features: [
      "60-minute private sessions",
      "Goal setting and accountability",
      "Mindset transformation",
      "Life and career guidance",
      "Virtual or in-person options",
    ],
    price: "From R800/session",
    cta: "Book a Session",
    link: "/booking",
  },
  {
    id: "workshops",
    title: "Group Workshops",
    icon: Users,
    description: "Interactive workshops covering topics from career to wellness",
    image: eventImage,
    features: [
      "Half-day and full-day options",
      "Expert facilitators",
      "Workbooks and resources",
      "Networking opportunities",
      "Certificate of completion",
    ],
    price: "From R450/person",
    cta: "View Workshops",
    link: "/events",
  },
  {
    id: "retreats",
    title: "Wellness Retreats",
    icon: Heart,
    description: "Immersive getaways for deep rest and transformation",
    image: retreatImage,
    features: [
      "Weekend and week-long options",
      "Beautiful retreat venues",
      "Yoga and meditation",
      "Gourmet wellness cuisine",
      "Spa treatments included",
    ],
    price: "From R3,500",
    cta: "Explore Retreats",
    link: "/events",
  },
  {
    id: "corporate",
    title: "Corporate Programs",
    icon: Flower2,
    description: "Custom wellness programs for organizations",
    image: coachingImage,
    features: [
      "Tailored to your team needs",
      "On-site or virtual delivery",
      "Women's wellness focus",
      "Leadership development",
      "Team building activities",
    ],
    price: "Custom Quote",
    cta: "Get a Quote",
    link: "/contact",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              How We Serve You
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              Our <span className="text-primary italic">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              From intimate coaching sessions to transformative retreats, discover the 
              right path for your personal growth journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-3xl shadow-elevated"
                  />
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blush mb-6">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-foreground">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-6">
                    <span className="font-display text-2xl font-semibold text-primary">
                      {service.price}
                    </span>
                    <Button variant="default" asChild>
                      <Link to={service.link}>
                        {service.cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Packages */}
      <section className="section-padding bg-gradient-soft">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Coaching Packages</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
              Invest in Your Growth
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                sessions: 4,
                price: "R2,800",
                description: "Perfect for exploring coaching",
                features: ["4 x 60-min sessions", "Email support", "Resource library access"],
              },
              {
                name: "Transform",
                sessions: 8,
                price: "R5,200",
                description: "Our most popular package",
                features: ["8 x 60-min sessions", "WhatsApp support", "Resource library access", "1 group workshop"],
                popular: true,
              },
              {
                name: "Elevate",
                sessions: 12,
                price: "R7,200",
                description: "Deep, lasting transformation",
                features: ["12 x 60-min sessions", "Priority support", "All resources", "2 group workshops", "Retreat discount"],
              },
            ].map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative ${pkg.popular ? "border-primary shadow-glow" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  <div className="mt-4">
                    <span className="font-display text-4xl font-semibold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/{pkg.sessions} sessions</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={pkg.popular ? "hero" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-muted-foreground mb-10">
              Book a free 15-minute discovery call and let's find the perfect path for your journey.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Schedule a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
