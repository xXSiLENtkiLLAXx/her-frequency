import { Link } from "react-router-dom";
import { Heart, Sparkles, Users, Flower2, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-sisterhood.jpg";
import coachingImage from "@/assets/coaching-session.jpg";
const values = [{
  icon: Heart,
  title: "Empowerment",
  description: "We believe every woman has the power to create the life she desires."
}, {
  icon: Sparkles,
  title: "Authenticity",
  description: "We encourage showing up as your true self, without masks or pretense."
}, {
  icon: Flower2,
  title: "Wellness",
  description: "Holistic wellbeing of mind, body, and spirit is at our core."
}, {
  icon: Users,
  title: "Inclusivity",
  description: "Every woman is welcome here, regardless of background or journey."
}, {
  icon: Heart,
  title: "Sisterhood",
  description: "We lift each other up, celebrate wins, and support through challenges."
}, {
  icon: Target,
  title: "Growth",
  description: "Continuous personal development and transformation is our path."
}];
const About = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Her Frequency community" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container-custom mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              About <span className="text-primary italic">Her Frequency</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A South African women's empowerment movement creating safe, uplifting spaces 
              for transformation and genuine connection.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src={coachingImage} alt="Women in conversation" className="rounded-3xl shadow-elevated" />
            </div>
            <div>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">To create transformative spaces where women can discover their authentic selves, connect with a supportive sisterhood, and access the tools and guidance needed to thrive in every area of life. Through events, workshops, and wellness experiences, we empower women to step into their full potential.</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading women's empowerment platform in South Africa and beyond, 
                  recognized for creating meaningful impact in the lives of women across all 
                  walks of life. We envision a world where every woman feels empowered, supported, 
                  and celebrated in her journey of becoming her highest self.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-padding bg-gradient-soft">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map(value => <Card key={value.title} className="p-8 bg-card/80 backdrop-blur-sm border-none">
                <CardContent className="pt-0">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blush mb-6">
                    <value.icon className="h-7 w-7 text-primary" />
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

      {/* Who We Serve */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Community</span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
                Who We Serve
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {["Professionals seeking work-life balance and personal growth", "Entrepreneurs building their dreams while nurturing themselves", "Creatives looking for inspiration and supportive community", "Mothers navigating the beautiful chaos of parenthood", "Students preparing for their next chapter with confidence", "Women in transition embracing new beginnings"].map((audience, index) => <div key={index} className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-foreground">{audience}</p>
                </div>)}
            </div>

            <p className="text-center text-muted-foreground mt-12 max-w-2xl mx-auto">
              We welcome women aged 23-55 from all backgrounds, united by a desire for 
              wellness, empowerment, and genuine connection. Whether you're a seasoned 
              professional or just starting your journey, there's a place for you here.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Ready to Join Our Sisterhood?
            </h2>
            <p className="text-muted-foreground mb-10">
              Take the first step in your transformation journey. Explore our upcoming events 
              or book a coaching session today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default About;