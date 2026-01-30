import { Link } from "react-router-dom";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const products = [
  {
    id: 1,
    name: "Her Frequency Journal",
    category: "Journals",
    price: "R350",
    description: "A guided journal for daily reflection, gratitude, and intention setting.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
  {
    id: 2,
    name: "Self-Love Candle Set",
    category: "Candles",
    price: "R280",
    description: "Three luxurious soy candles with calming scents: lavender, vanilla, and rose.",
    image: "https://images.unsplash.com/photo-1602607742492-47f7c7e2c2f5?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
  {
    id: 3,
    name: "Affirmation Card Deck",
    category: "Journals",
    price: "R180",
    description: "52 beautifully designed cards with empowering affirmations.",
    image: "https://images.unsplash.com/photo-1609205807107-d9d7e06d5c89?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
  {
    id: 4,
    name: "Her Frequency Tote Bag",
    category: "Apparel",
    price: "R220",
    description: "Organic cotton tote with our signature 'Becoming HER' print.",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
  {
    id: 5,
    name: "Meditation Cushion",
    category: "Wellness",
    price: "R450",
    description: "Comfortable floor cushion in blush pink for your mindfulness practice.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
  {
    id: 6,
    name: "Sisterhood Hoodie",
    category: "Apparel",
    price: "R480",
    description: "Cozy oversized hoodie with 'Sisterhood' embroidery in rose gold.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    paymentLink: "https://pos.snapscan.io/qr/yC2vQvlL",
  },
];

const categories = ["All", "Journals", "Candles", "Apparel", "Wellness"];

const Shop = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Curated for You
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              The <span className="text-primary italic">Shop</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Thoughtfully designed products to support your journey of self-discovery, 
              wellness, and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-semibold text-foreground">
                      {product.price}
                    </span>
                    <Button variant="default" size="sm" asChild>
                      <a href={product.paymentLink} target="_blank" rel="noopener noreferrer">
                        Buy Now <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              More Coming Soon
            </h2>
            <p className="text-muted-foreground mb-10">
              We're working on new products including wellness kits, branded apparel, 
              and exclusive collaborations. Join our newsletter to be the first to know!
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/#newsletter">Join Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
