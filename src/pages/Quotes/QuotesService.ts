
import { supabase } from "@/integrations/supabase/client";
import { Quote, CartItem } from "@/types";
import { createNotification } from "@/services/NotificationService";
import { mapQuote, mapQuotes, mapCartItems, mapOfferPlates } from "@/utils/dataMapper";

export const fetchQuoteById = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        offer_plate_id,
        agent_id,
        client_id,
        status,
        total_amount,
        created_at
      `)
      .eq("id", quoteId)
      .single();
    
    if (error) throw error;
    
    return mapQuote(data);
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

export const fetchQuotes = async (userId: string, isAgent: boolean, isAdmin: boolean) => {
  try {
    let query = supabase.from("quotes").select(`
      id,
      offer_plate_id,
      client_id,
      agent_id,
      status,
      total_amount,
      created_at
    `);

    if (isAdmin) {
      // Admin can see all quotes
    } else if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return mapQuotes(data);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

export const fetchQuoteDetails = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        offer_plate_id,
        client_id,
        agent_id,
        status,
        total_amount,
        created_at,
        offer_plates (
          id,
          name
        )
      `)
      .eq("id", quoteId)
      .single();
    
    if (error) throw error;
    
    // Create a mapped quote with the mapped offer_plates
    const mappedQuote = mapQuote(data);
    return {
      ...mappedQuote,
      offer_plates: data.offer_plates // Keep original structure for this nested object
    };
  } catch (error) {
    console.error("Error fetching quote details:", error);
    throw error;
  }
};

export const fetchQuoteItems = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plate_items")
      .select(`
        id,
        quantity,
        offer_id,
        offers (
          id,
          name,
          description,
          price_monthly,
          setup_fee,
          category,
          image_url
        )
      `)
      .eq("offer_plate_id", offerPlateId);
    
    if (error) throw error;
    
    return mapCartItems(data);
  } catch (error) {
    console.error("Error fetching quote items:", error);
    throw error;
  }
};

export const createQuote = async (offerPlateId: string, totalAmount: number, clientId: string, agentId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        offer_plate_id: offerPlateId,
        client_id: clientId,
        agent_id: agentId,
        total_amount: totalAmount,
      })
      .select()
      .single();
    
    if (error) throw error;
    return mapQuote(data);
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
};

export const updateQuoteStatus = async (quoteId: string, status: string) => {
  try {
    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating quote status:", error);
    throw error;
  }
};

export const fetchOfferPlatesWithoutQuotes = async (userId: string, isAgent: boolean) => {
  try {
    let query = supabase.from("offer_plates")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        status,
        created_at
      `)
      .neq("status", "draft");
    
    if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }
    
    const { data: offerPlates, error: offerPlatesError } = await query;
    
    if (offerPlatesError) throw offerPlatesError;
    
    // Get all quotes for these offer plates
    const { data: quotes, error: quotesError } = await supabase
      .from("quotes")
      .select("offer_plate_id");
    
    if (quotesError) throw quotesError;
    
    // Filter out offer plates that already have quotes
    const offerPlateIdsWithQuotes = quotes.map((q: any) => q.offer_plate_id);
    
    const platesWithoutQuotes = offerPlates.filter(
      (plate: any) => !offerPlateIdsWithQuotes.includes(plate.id)
    );
    
    return mapOfferPlates(platesWithoutQuotes);
  } catch (error) {
    console.error("Error fetching offer plates without quotes:", error);
    throw error;
  }
};

export const createPaymentInfo = async (paymentData: {
  quoteId: string;
  bankName: string;
  iban: string;
  bic: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .insert({
        quote_id: paymentData.quoteId,
        bank_name: paymentData.bankName,
        iban: paymentData.iban,
        bic: paymentData.bic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating payment info:", error);
    throw error;
  }
};

export const fetchPaymentInfoByQuoteId = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .select("*")
      .eq("quote_id", quoteId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching payment info:", error);
    throw error;
  }
};
