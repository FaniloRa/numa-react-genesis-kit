
import { supabase } from "@/integrations/supabase/client";
import { mapOffers, mapCartItems } from "@/utils/dataMapper";
import { User, Offer, CartItem, OfferPlate } from "@/types";

export const createOfferPlate = async (
  name: string, 
  agentId: string, 
  clientId: string, 
  items: CartItem[]
) => {
  try {
    // Commencer une transaction
    const { data: offerPlateData, error: offerPlateError } = await supabase
      .from('offer_plates')
      .insert({
        name,
        agent_id: agentId,
        client_id: clientId,
        status: 'draft'
      })
      .select()
      .single();

    if (offerPlateError) throw offerPlateError;

    // Insérer les items de la plaquette
    const itemsToInsert = items.map(item => ({
      offer_plate_id: offerPlateData.id,
      offer_id: item.offerId,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('offer_plate_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return offerPlateData;
  } catch (error) {
    console.error("Erreur lors de la création de la plaquette d'offres :", error);
    throw error;
  }
};

export const fetchClientProfiles = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('role', 'client');
    
    if (error) throw error;
    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: 'client'
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
};

export const sendOfferPlateThroughPlatform = async (
  offerPlateId: string, 
  clientId: string
) => {
  try {
    const { error } = await supabase
      .from('offer_plates')
      .update({
        status: 'sent', 
        sent_at: new Date().toISOString(),
        sent_method: 'platform',
        client_id: clientId
      })
      .eq('id', offerPlateId);

    if (error) throw error;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la plaquette :", error);
    throw error;
  }
};

export const fetchOfferPlateDetails = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from('offer_plates')
      .select(`
        id, 
        name, 
        status, 
        agent_id,
        client_id,
        offer_plate_items (
          quantity,
          offers (
            id, 
            name, 
            description, 
            price_monthly, 
            setup_fee, 
            category
          )
        )
      `)
      .eq('id', offerPlateId)
      .single();

    if (error) throw error;

    return {
      ...data,
      items: data.offer_plate_items.map(item => ({
        offerId: item.offers.id,
        offer: item.offers,
        quantity: item.quantity
      }))
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la plaquette :", error);
    throw error;
  }
};
