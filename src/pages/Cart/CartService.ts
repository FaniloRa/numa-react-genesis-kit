
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Offer } from "@/types";

export const fetchCartItems = async (userId: string) => {
  try {
    // First, find the user's cart (draft offer plate)
    const { data: cart, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft")
      .maybeSingle();
    
    if (cartError) throw cartError;
    if (!cart) return [];
    
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
          price,
          category,
          image_url
        )
      `)
      .eq("offer_plate_id", cart.id);
    
    if (itemsError) throw itemsError;
    
    // Transform the data to match our CartItem type
    return cartItems.map((item: any) => ({
      offerId: item.offer_id,
      offer: item.offers as Offer,
      quantity: item.quantity,
      id: item.id
    })) as CartItem[];
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
    const { data: cart, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft")
      .maybeSingle();
    
    if (cartError) throw cartError;
    if (!cart) throw new Error("Votre panier est vide");
    
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
