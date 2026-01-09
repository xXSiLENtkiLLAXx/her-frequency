import { ChevronDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Events",
    questions: [
      {
        question: "How do I book tickets for an event?",
        answer: "You can book tickets directly through our Events page. Each event has a 'Book Now' button that will redirect you to our secure payment partner, Zapper. Once payment is confirmed, you'll receive a confirmation email with all event details.",
      },
      {
        question: "What is your cancellation/refund policy?",
        answer: "We offer full refunds for cancellations made 14+ days before the event. Cancellations 7-13 days before receive a 50% refund. Within 7 days, we cannot offer refunds but you can transfer your ticket to someone else or receive credit for a future event.",
      },
      {
        question: "Are your events suitable for introverts?",
        answer: "Absolutely! We design our events to be inclusive of all personality types. While there are networking opportunities, there's never any pressure to be the most outgoing person in the room. Many women attend solo and leave with meaningful connections.",
      },
      {
        question: "Can I bring a friend?",
        answer: "Yes! We encourage it. Each person will need their own ticket, but there's nothing like experiencing transformation alongside a friend. We also have occasional 'bring a friend' promotions - sign up for our newsletter to be notified.",
      },
    ],
  },
  {
    category: "Coaching",
    questions: [
      {
        question: "How do coaching sessions work?",
        answer: "Coaching sessions are 60-minute one-on-one conversations either virtually (via Zoom) or in-person (Johannesburg area). After booking, you'll complete a brief questionnaire so your coach can prepare. Sessions focus on your specific goals, challenges, and next steps.",
      },
      {
        question: "How do I choose the right coach for me?",
        answer: "We offer a complimentary 15-minute discovery call where you can meet your potential coach and ensure it's the right fit. Our coaches specialize in different areas (career, life transitions, wellness), and we'll match you based on your needs.",
      },
      {
        question: "What's the difference between coaching packages?",
        answer: "Our packages differ in the number of sessions and additional support included. Starter (4 sessions) is great for addressing a specific challenge. Transform (8 sessions) allows for deeper work. Elevate (12 sessions) provides comprehensive transformation with ongoing support.",
      },
    ],
  },
  {
    category: "Retreats",
    questions: [
      {
        question: "What's included in retreat pricing?",
        answer: "Our retreat prices typically include accommodation, all meals, workshops, yoga/meditation sessions, and materials. Some retreats include spa treatments. Transportation to the venue is usually not included unless specified. Full details are listed on each retreat page.",
      },
      {
        question: "I've never done yoga/meditation. Can I still attend?",
        answer: "Absolutely! Our retreats welcome all experience levels. Activities are adaptable, and there's never any pressure to participate in anything that doesn't feel right for you. The goal is rest and renewal - however that looks for you.",
      },
      {
        question: "Can I share a room?",
        answer: "Most retreats offer both private and shared room options at different price points. Shared rooms are perfect for those attending with friends or who want to reduce costs. Details are specified during booking.",
      },
    ],
  },
  {
    category: "Shop & Products",
    questions: [
      {
        question: "How do I purchase products?",
        answer: "Click on any product and select 'Buy Now' to be redirected to our secure Zapper payment page. After payment, we'll send a confirmation email and shipping details.",
      },
      {
        question: "What are the shipping costs and times?",
        answer: "We offer free shipping on orders over R500. Standard shipping (3-5 business days) is R50. Express shipping (1-2 business days) is R100. Currently shipping within South Africa only.",
      },
      {
        question: "Can I return a product?",
        answer: "We accept returns within 14 days of delivery for unused items in original packaging. Please email us to initiate a return. Personalized items cannot be returned unless damaged.",
      },
    ],
  },
  {
    category: "General",
    questions: [
      {
        question: "Is there a membership program?",
        answer: "We're currently developing an exclusive membership program that will offer priority event access, member-only content, and special pricing. Join our newsletter to be the first to know when it launches!",
      },
      {
        question: "Do you offer corporate/group packages?",
        answer: "Yes! We create customized wellness and empowerment programs for organizations. This includes team workshops, leadership development for women, and wellness days. Contact us for a tailored quote.",
      },
      {
        question: "How can I collaborate or partner with Her Frequency?",
        answer: "We're always open to partnerships that align with our mission. Whether you're a venue, speaker, wellness practitioner, or brand, reach out via our contact form with your proposal.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Got Questions?
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              Frequently Asked <span className="text-primary italic">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to the most common questions about our events, 
              services, and community.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          {faqs.map((section, sectionIndex) => (
            <div key={section.category} className="mb-12">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${sectionIndex}-${index}`}
                    className="border border-border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-10">
              Can't find what you're looking for? We're here to help. 
              Reach out and we'll get back to you within 24-48 hours.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
