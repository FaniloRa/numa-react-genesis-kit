
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export const fetchClients = async (searchTerm?: string) => {
  try {
    let query = supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        birth_date,
        created_at
      `)
      .eq("role", "client");

    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    return data as User[];
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
        email,
        phone,
        address,
        birth_date,
        created_at
      `)
      .eq("id", clientId)
      .single();
    
    if (error) throw error;
    return data as User;
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
