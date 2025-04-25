
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { mapUsers, mapUser } from "@/utils/dataMapper";

export const fetchClients = async (searchTerm?: string) => {
  try {
    let query = supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        address,
        birth_date,
        role,
        created_at
      `)
      .eq("role", "client");

    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Add email field to match User interface (since profiles doesn't have email)
    const users = data.map(profile => ({
      ...profile,
      email: `${profile.first_name?.toLowerCase() || ''}${profile.last_name?.toLowerCase() || ''}@example.com` // Placeholder email
    }));
    
    return mapUsers(users);
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const fetchClientDetails = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        address,
        birth_date,
        role,
        created_at
      `)
      .eq("id", clientId)
      .single();
    
    if (error) throw error;
    
    // Add email field to match User interface
    const user = {
      ...data,
      email: `${data.first_name?.toLowerCase() || ''}${data.last_name?.toLowerCase() || ''}@example.com` // Placeholder email
    };
    
    return mapUser(user);
  } catch (error) {
    console.error("Error fetching client details:", error);
    throw error;
  }
};

export const fetchClientFolders = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("folders")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        created_at,
        profiles!folders_agent_id_fkey (
          first_name,
          last_name
        )
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching client folders:", error);
    throw error;
  }
};

export const fetchClientQuotes = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        agent_id,
        profiles!quotes_agent_id_fkey (
          first_name,
          last_name
        )
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching client quotes:", error);
    throw error;
  }
};
