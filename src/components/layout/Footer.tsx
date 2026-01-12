import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const footerLinks = {
  company: [{
    name: "About Us",
    href: "/about"
  }, {
    name: "Our Mission",
    href: "/about#mission"
  }, {
    name: "Testimonials",
    href: "/testimonials"
  }, {
    name: "FAQ",
    href: "/faq"
  }],
  services: [{
    name: "Events",
    href: "/events"
  }, {
    name: "Coaching",
    href: "/services#coaching"
  }, {
    name: "Workshops",
    href: "/services#workshops"
  }, {
    name: "Retreats",
    href: "/services#retreats"
  }],
  shop: [{
    name: "All Products",
    href: "/shop"
  }, {
    name: "Journals",
    href: "/shop#journals"
  }, {
    name: "Candles",
    href: "/shop#candles"
  }, {
    name: "Apparel",
    href: "/shop#apparel"
  }]
};
export function Footer() {
  return <footer className="bg-muted/50 border-t border-border">
      {/* Newsletter Section */}
      <div className="container-custom mx-auto px-4 md:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Join the Sisterhood
          </h3>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for empowerment tips, wellness insights, and exclusive event invitations.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="flex-1" />
            <Button variant="default" type="submit">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-2xl font-semibold text-foreground">
                Her <span className="text-primary">Frequency</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Creating safe, uplifting spaces for women to transform, connect, and thrive.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:hello@herfrequency.co.za" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Cape Town, South Africa</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="h-4 w-4 text-primary" />
            <a href="mailto:hello@herfrequency.co.za" className="hover:text-primary transition-colors">
              hello@herfrequency.co.za
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> by Her Frequency © {new Date().getFullYear()}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            Becoming HER, one day at a time.
          </p>
        </div>
      </div>
    </footer>;
}