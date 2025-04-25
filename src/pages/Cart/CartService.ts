
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types";
import { mapCartItems } from "@/utils/dataMapper";

export const fetchCartItems = async (userId: string) => {
  try {
    // First, find the user's cart (draft offer plate)
    const { data: carts, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft");
    
    if (cartError) throw cartError;
    if (!carts || carts.length === 0) return [];
    
    // Use the first cart if multiple exist (this handles the case of multiple draft carts)
    const cart = carts[0];
    
    // Then, get all items in that cart with their associated offers
    const { data: cartItems, error: itemsError } = await supabase
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
          is_active,
          category,
          image_url
        )
      `)
      .eq("offer_plate_id", cart.id);
    
    if (itemsError) throw itemsError;
    
    // Use the mapper to transform the data
    return mapCartItems(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  try {
    const { error } = await supabase
      .from("offer_plate_items")
      .update({ quantity })
      .eq("id", itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from("offer_plate_items")
      .delete()
      .eq("id", itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const createOfferPlate = async (userId: string, name: string = "Plaquette d'offres") => {
  try {
    // Find the user's cart
    const { data: carts, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft");
    
    if (cartError) throw cartError;
    if (!carts || carts.length === 0) throw new Error("Votre panier est vide");
    
    // Use the first cart if multiple exist
    const cart = carts[0];
    
    // Create a new offer plate with the cart items
    const { data: newOfferPlate, error: createError } = await supabase
      .from("offer_plates")
      .update({
        name,
        status: "sent"
      })
      .eq("id", cart.id)
      .select()
      .single();
    
    if (createError) throw createError;
    
    return newOfferPlate;
  } catch (error) {
    console.error("Error creating offer plate:", error);
    throw error;
  }
};
