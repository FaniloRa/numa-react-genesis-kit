
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
    // Get the URL parameters
    const url = new URL(req.url);
    const quoteId = url.searchParams.get("quoteId");

    // Get the payment status from the request body
    const { status } = await req.json();
    
    if (!quoteId) {
      throw new Error("Quote ID is required");
    }

    console.log(`Received payment callback for quote ${quoteId} with status: ${status}`);

    // If the payment was successful, update the quote's payment status
    if (status === "PAID" || status === "SUCCESS") {
      // Create supabase client with service role key for admin privileges
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update the quote
      const { data, error } = await supabase
        .from('quotes')
        .update({ payment_status: 'Payé' })
        .eq('id', quoteId);

      if (error) throw error;
      
      console.log(`Updated payment status for quote ${quoteId} to Payé`);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response(JSON.stringify({ success: false, message: "Payment not successful" }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
