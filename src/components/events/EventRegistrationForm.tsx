import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import logger from "@/lib/logger";
import { checkRateLimit, recordAttempt, rateLimiters } from "@/lib/rateLimiter";

interface EventRegistrationFormProps {
  eventId: number;
  eventTitle: string;
  paymentLink: string;
  onRegistrationComplete: () => void;
}

export const EventRegistrationForm = ({
  eventId,
  eventTitle,
  paymentLink,
  onRegistrationComplete,
}: EventRegistrationFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "payment" | "confirmation">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit before proceeding
    const { allowed, secondsRemaining } = checkRateLimit(rateLimiters.eventRegistration);
    if (!allowed) {
      const minutes = Math.ceil(secondsRemaining / 60);
      toast({
        title: "Please Wait",
        description: `You can submit another registration in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save registration to database
      const { data, error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          cellphone: formData.cellphone.trim(),
          payment_confirmed: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Record successful submission for rate limiting
      recordAttempt(rateLimiters.eventRegistration.key, rateLimiters.eventRegistration.windowMs);

      setRegistrationId(data.id);
      setStep("payment");
      
      toast({
        title: "Registration Saved",
        description: "Please complete your payment using the link below.",
      });
    } catch (error) {
      logger.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us for assistance.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!registrationId) return;
    setIsSubmitting(true);

    try {
      // Update registration as payment confirmed
      const { error: updateError } = await supabase
        .from("event_registrations")
        .update({
          payment_confirmed: true,
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", registrationId);

      if (updateError) throw updateError;

      // Send confirmation email via FormSubmit
      const formSubmitData = new FormData();
      formSubmitData.append("name", `${formData.firstName} ${formData.lastName}`);
      formSubmitData.append("email", formData.email);
      formSubmitData.append("cellphone", formData.cellphone);
      formSubmitData.append("event", eventTitle);
      formSubmitData.append("_subject", `Payment Confirmation - ${eventTitle}`);
      formSubmitData.append("_template", "box");
      formSubmitData.append("message", `Thank you for your payment for ${eventTitle}! We have received your registration and look forward to seeing you at the event.\n\nDetails:\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nCellphone: ${formData.cellphone}`);

      await fetch("https://formsubmit.co/ajax/herfrequencyza@gmail.com", {
        method: "POST",
        body: formSubmitData,
      });

      setStep("confirmation");
      onRegistrationComplete();
      
      toast({
        title: "Payment Confirmed!",
        description: "Thank you! A confirmation email has been sent.",
      });
    } catch (error) {
      logger.error("Confirmation error:", error);
      toast({
        title: "Confirmation Failed",
        description: "Please contact us to confirm your payment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h3 className="font-display text-2xl font-semibold text-foreground">
          Thank You!
        </h3>
        <p className="text-muted-foreground">
          Your payment has been confirmed. We've sent a confirmation email to{" "}
          <span className="font-medium text-foreground">{formData.email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          We look forward to seeing you at {eventTitle}!
        </p>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Complete Your Payment
          </h3>
          <p className="text-muted-foreground text-sm">
            Click the button below to pay via SnapScan, then confirm your payment.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Registration for:</p>
          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
        </div>

        <Button className="w-full" size="lg" asChild>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            Pay Now via SnapScan <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>

        <div className="border-t border-border pt-4">
          <p className="text-sm text-center text-muted-foreground mb-4">
            After completing payment, click below to confirm:
          </p>
          <Button
            onClick={handleConfirmPayment}
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "I've Completed Payment"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitRegistration} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Register for Event
        </h3>
        <p className="text-muted-foreground text-sm">
          Fill in your details to reserve your spot
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cellphone">Cellphone Number</Label>
        <Input
          id="cellphone"
          name="cellphone"
          type="tel"
          required
          value={formData.cellphone}
          onChange={handleInputChange}
          placeholder="+27 XX XXX XXXX"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Continue to Payment"
        )}
      </Button>
    </form>
  );
};
