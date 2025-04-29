
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { quoteId, totalAmount, clientEmail } = await req.json();
    
    // Create supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate callback URL for the payment status update
    const callbackUrl = `${supabaseUrl}/functions/v1/payment-callback?quoteId=${quoteId}`;
    
    // Make the API call to PAPI.mg
    const apiKey = Deno.env.get("PAPI_API_KEY") || "";
    const response = await fetch('https://app-staging.papi.mg/dashboard/api/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'key': apiKey,
      },
      body: JSON.stringify({
        change: {
          currency: "EUR",
          rate: 1
        },
        amount: totalAmount,
        successUrl: `${req.headers.get("origin")}/payment-success?quoteId=${quoteId}`,
        failureUrl: `${req.headers.get("origin")}/payment-failure?quoteId=${quoteId}`,
        callbackUrl: callbackUrl,
        clientEmail: clientEmail,
        paymentDescription: "Plaquette d'offres",
        methods: ["ORANGE_MONEY", "MVOLA", "VISA"],
        message: "Plaquette d'offres"
      })
    });

    const data = await response.json();
    
    // Log the response
    console.log("Payment API response:", data);

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
