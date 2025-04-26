
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Quote, OfferPlate, PaymentInfo } from "@/types";
import { mapQuotes, mapQuote, mapCartItems, mapOfferPlates } from "@/utils/dataMapper";

// Function to fetch all quotes
export const fetchQuotes = async (userId: string, isAgent: boolean, isAdmin: boolean) => {
  try {
    let query = supabase
      .from("quotes")
      .select(`
        *,
        offer_plates (name),
        profiles:client_id (email, first_name, last_name)
      `)
      .order("created_at", { ascending: false });
    
    if (isAdmin) {
      // Admin sees all quotes
    } else if (isAgent) {
      // Agent only sees quotes they created
      query = query.eq("agent_id", userId);
    } else {
      // Client only sees their own quotes
      query = query.eq("client_id", userId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return mapQuotes(data || []);
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    throw new Error(error.message || "Failed to load quotes");
  }
};

// Function to fetch a specific quote by ID
export const fetchQuoteById = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        offer_plates (name),
        profiles:client_id (email, first_name, last_name)
      `)
      .eq("id", quoteId)
      .single();

    if (error) throw new Error(error.message);
    return mapQuote(data);
  } catch (error: any) {
    console.error("Error fetching quote:", error);
    throw new Error(error.message || "Failed to load quote");
  }
};

// Function to fetch quote details
export const fetchQuoteDetails = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        offer_plates (*),
        client:client_id (first_name, last_name, email)
      `)
      .eq("id", quoteId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error("Error fetching quote details:", error);
    throw new Error(error.message || "Failed to load quote details");
  }
};

// Function to fetch items for a quote
export const fetchQuoteItems = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plate_items")
      .select(`
        *,
        offers (*)
      `)
      .eq("offer_plate_id", offerPlateId);

    if (error) throw new Error(error.message);
    
    return mapCartItems(data || []);
  } catch (error: any) {
    console.error("Error fetching quote items:", error);
    throw new Error(error.message || "Failed to load quote items");
  }
};

// Function to update quote status
export const updateQuoteStatus = async (quoteId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapQuote(data);
  } catch (error: any) {
    console.error("Error updating quote status:", error);
    throw new Error(error.message || "Failed to update quote status");
  }
};

// Function to fetch payment information by quote ID
export const fetchPaymentInfoByQuoteId = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .select("*")
      .eq("quote_id", quoteId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No payment info found
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching payment info:", error);
    throw new Error(error.message || "Failed to load payment information");
  }
};

// Function to create payment information for a quote
export const createPaymentInfo = async (paymentInfo: {
  quoteId: string;
  bankName: string;
  iban: string;
  bic: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .insert({
        quote_id: paymentInfo.quoteId,
        bank_name: paymentInfo.bankName,
        iban: paymentInfo.iban,
        bic: paymentInfo.bic
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error("Error creating payment info:", error);
    throw new Error(error.message || "Failed to create payment information");
  }
};

// Function to create a new quote
export const createQuote = async (
  offerPlateId: string,
  totalAmount: number,
  clientId: string,
  agentId: string
) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        agent_id: agentId,
        offer_plate_id: offerPlateId,
        client_id: clientId,
        total_amount: totalAmount,
        status: "pending"
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error("Error creating quote:", error);
    throw new Error(error.message || "Failed to create quote");
  }
};

// Function to fetch offer plates that don't have quotes yet
export const fetchOfferPlatesWithoutQuotes = async (userId: string, isAgent: boolean) => {
  try {
    let query = supabase
      .from("offer_plates")
      .select(`
        *,
        client:client_id (first_name, last_name)
      `);
    
    if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    return mapOfferPlates(data || []);
  } catch (error: any) {
    console.error("Error fetching offer plates:", error);
    throw new Error(error.message || "Failed to load offer plates");
  }
};

// Function to fetch all offer plates for a user
export const fetchOfferPlatesByAgent = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plates")
      .select(`
        *,
        client:client_id (first_name, last_name)
      `)
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return mapOfferPlates(data || []);
  } catch (error: any) {
    console.error("Error fetching offer plates:", error);
    throw new Error(error.message || "Failed to load offer plates");
  }
};
