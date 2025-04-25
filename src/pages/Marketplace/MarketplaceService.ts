import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/types";
import { mapOffers } from "@/utils/dataMapper";

export const fetchOffers = async (searchTerm?: string, category?: string) => {
  try {
    let query = supabase.from("offers").select("*");

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Use mapper to convert snake_case to camelCase
    return mapOffers(data);
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("category")
      .order("category");

    if (error) {
      throw error;
    }

    // Remove duplicates
    const categories = [...new Set(data.map((item) => item.category))];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addToCart = async (offer: Offer, quantity: number = 1, userId: string) => {
  try {
    // Check if there's an existing cart (draft offer plate)
    const { data: existingCart, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft")
      .maybeSingle();
    
    if (cartError) throw cartError;
    
    // Create a new cart if none exists
    let cartId = existingCart?.id;
    
    if (!cartId) {
      const { data: newCart, error: createError } = await supabase
        .from("offer_plates")
        .insert({
          client_id: userId,
          agent_id: userId, // In this case the client is the agent of their own cart
          name: "Mon panier",
          status: "draft"
        })
        .select()
        .single();
      
      if (createError) throw createError;
      cartId = newCart.id;
    }
    
    // Check if the offer already exists in the cart
    const { data: existingItem, error: itemError } = await supabase
      .from("offer_plate_items")
      .select("*")
      .eq("offer_plate_id", cartId)
      .eq("offer_id", offer.id)
      .maybeSingle();
    
    if (itemError) throw itemError;
    
    if (existingItem) {
      // Update quantity if item exists
      const { error: updateError } = await supabase
        .from("offer_plate_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
      
      if (updateError) throw updateError;
    } else {
      // Add new item if it doesn't exist
      const { error: addError } = await supabase
        .from("offer_plate_items")
        .insert({
          offer_plate_id: cartId,
          offer_id: offer.id,
          quantity
        });
      
      if (addError) throw addError;
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
