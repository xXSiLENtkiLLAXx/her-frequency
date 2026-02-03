import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://her-frequency.lovable.app",
  "https://id-preview--75508879-0b3f-4010-8e00-d7db1a2bfe1c.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || "")
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Validate origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn("Blocked request from unauthorized origin:", origin);
    return new Response(
      JSON.stringify({ error: "Origin not allowed" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { registration_id } = await req.json();

    console.log("Confirm payment request received for registration:", registration_id);

    // Validate input
    if (!registration_id || typeof registration_id !== "string") {
      console.error("Invalid registration_id provided");
      return new Response(
        JSON.stringify({ error: "Invalid registration ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(registration_id)) {
      console.error("Invalid UUID format for registration_id");
      return new Response(
        JSON.stringify({ error: "Invalid registration ID format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // First, verify the registration exists and is not already confirmed
    const { data: existingReg, error: fetchError } = await supabaseAdmin
      .from("event_registrations")
      .select("id, payment_confirmed")
      .eq("id", registration_id)
      .single();

    if (fetchError || !existingReg) {
      console.error("Registration not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "Registration not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingReg.payment_confirmed) {
      console.log("Payment already confirmed for registration:", registration_id);
      return new Response(
        JSON.stringify({ success: true, message: "Payment already confirmed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the registration to mark payment as confirmed
    // NOTE: In a production system, you would integrate with SnapScan's API here
    // to verify the actual payment before confirming. Since SnapScan doesn't have
    // a public verification API, this confirmation should be treated as a 
    // "user claims payment complete" flag for admin follow-up verification.
    const { error: updateError } = await supabaseAdmin
      .from("event_registrations")
      .update({
        payment_confirmed: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", registration_id);

    if (updateError) {
      console.error("Failed to confirm payment:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to confirm payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Payment confirmed successfully for registration:", registration_id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in confirm-payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
