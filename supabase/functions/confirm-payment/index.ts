import { createClient } from "npm:@supabase/supabase-js@2";

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

// Generate a cryptographically secure token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

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

  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const { action, registration_id, confirmation_token, registration_data } = body;

    console.log("Confirm payment request received:", { action, registration_id });

    // ACTION 1: Create registration and generate token
    if (action === "create_registration") {
      if (!registration_data) {
        return new Response(
          JSON.stringify({ error: "Missing registration data" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { event_id, first_name, last_name, email, cellphone } = registration_data;

      // Validate required fields
      if (!event_id || !first_name || !last_name || !email || !cellphone) {
        return new Response(
          JSON.stringify({ error: "Missing required registration fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate event_id is a positive integer
      if (typeof event_id !== "number" || event_id <= 0 || !Number.isInteger(event_id)) {
        return new Response(
          JSON.stringify({ error: "Invalid event ID" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate string fields
      if (typeof first_name !== "string" || first_name.trim().length === 0 || first_name.length > 100) {
        return new Response(
          JSON.stringify({ error: "Invalid first name" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof last_name !== "string" || last_name.trim().length === 0 || last_name.length > 100) {
        return new Response(
          JSON.stringify({ error: "Invalid last name" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof email !== "string" || !emailRegex.test(email) || email.length > 255) {
        return new Response(
          JSON.stringify({ error: "Invalid email address" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof cellphone !== "string" || cellphone.trim().length === 0 || cellphone.length > 20) {
        return new Response(
          JSON.stringify({ error: "Invalid cellphone number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate secure confirmation token
      const token = generateSecureToken();

      // Insert registration with token
      const { data, error: insertError } = await supabaseAdmin
        .from("event_registrations")
        .insert({
          event_id,
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim().toLowerCase(),
          cellphone: cellphone.trim(),
          payment_confirmed: false,
          confirmation_token: token,
        })
        .select("id, confirmation_token")
        .single();

      if (insertError) {
        console.error("Failed to create registration:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create registration" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Registration created successfully:", data.id);

      return new Response(
        JSON.stringify({
          success: true,
          registration_id: data.id,
          confirmation_token: data.confirmation_token,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 2: Confirm payment with token verification
    if (action === "confirm_payment") {
      // Validate registration_id
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

      // Validate confirmation_token
      if (!confirmation_token || typeof confirmation_token !== "string") {
        console.error("Missing or invalid confirmation token");
        return new Response(
          JSON.stringify({ error: "Missing confirmation token" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Token format validation (64 hex characters)
      const tokenRegex = /^[0-9a-f]{64}$/i;
      if (!tokenRegex.test(confirmation_token)) {
        console.error("Invalid token format");
        return new Response(
          JSON.stringify({ error: "Invalid confirmation token format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify the registration exists AND the token matches
      const { data: existingReg, error: fetchError } = await supabaseAdmin
        .from("event_registrations")
        .select("id, payment_confirmed, confirmation_token")
        .eq("id", registration_id)
        .single();

      if (fetchError || !existingReg) {
        console.error("Registration not found:", fetchError);
        return new Response(
          JSON.stringify({ error: "Registration not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // CRITICAL: Verify the confirmation token matches
      if (existingReg.confirmation_token !== confirmation_token) {
        console.warn("Invalid confirmation token for registration:", registration_id);
        return new Response(
          JSON.stringify({ error: "Invalid confirmation token" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      // NOTE: In a production system, you would also integrate with SnapScan's API here
      // to verify the actual payment before confirming. The token verification ensures
      // only the person who created the registration can confirm it.
      const { error: updateError } = await supabaseAdmin
        .from("event_registrations")
        .update({
          payment_confirmed: true,
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", registration_id)
        .eq("confirmation_token", confirmation_token); // Double-check token in update

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
    }

    // Unknown action
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in confirm-payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
