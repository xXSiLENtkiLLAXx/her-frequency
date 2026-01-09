import { useState } from "react";
import { Calendar, Clock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const services = [
  { id: "discovery", name: "Free Discovery Call", duration: "15 min", price: "Free" },
  { id: "coaching", name: "1-on-1 Coaching Session", duration: "60 min", price: "R800" },
  { id: "workshop-private", name: "Private Workshop", duration: "3 hours", price: "R2,500" },
];

const Booking = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      toast({
        title: "Please select a service",
        description: "Choose the service you'd like to book.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Booking Request Received!",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    });
    setSelectedService("");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Start Your Journey
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              Book a <span className="text-primary italic">Session</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to take the next step? Book a coaching session or discovery call 
              to explore how we can support your transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Select a Service
              </h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id
                        ? "border-primary shadow-soft"
                        : "hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </span>
                          <span className="font-medium text-primary">{service.price}</span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedService === service.id
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {selectedService === service.id && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-muted/50">
                <h3 className="font-display font-semibold text-foreground mb-3">
                  What to Expect
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Submit your booking request
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    We'll confirm availability within 24h
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Receive calendar invite & prep materials
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Payment link sent before session
                  </li>
                </ul>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Your Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+27..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                        Preferred Time
                      </label>
                      <select
                        id="time"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-base font-body ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (9am - 12pm)</option>
                        <option value="afternoon">Afternoon (12pm - 5pm)</option>
                        <option value="evening">Evening (5pm - 7pm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                      What would you like to focus on?
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      placeholder="Tell us briefly about your goals or what you'd like to discuss..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-base font-body ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 resize-none"
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Request Booking <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
