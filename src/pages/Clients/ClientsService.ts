
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { mapUsers, mapUser } from "@/utils/dataMapper";

export const fetchClients = async (searchTerm?: string) => {
  try {
    // First, get the users from auth
    const { data: authUsers, error: authError } = await supabase
      .from("users")
      .select("id, email")
      .eq("role", "authenticated");

    if (authError) throw authError;

    // Then, get the profiles with full details
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

    const { data: profiles, error } = await query;
    
    if (error) throw error;
    
    // Combine the data, using real emails from auth.users where available
    const users = profiles.map(profile => {
      const authUser = authUsers ? authUsers.find(user => user.id === profile.id) : null;
      return {
        ...profile,
        email: authUser?.email || `${profile.first_name?.toLowerCase() || ''}${profile.last_name?.toLowerCase() || ''}@example.com`
      };
    });
    
    return mapUsers(users);
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const fetchClientDetails = async (clientId: string) => {
  try {
    // First, try to get the email from auth users
    const { data: authUser, error: authError } = await supabase
      .from("users")
      .select("email")
      .eq("id", clientId)
      .maybeSingle();

    // Then, get the profile details
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
    
    // Use real email if available, otherwise use the placeholder
    const email = authUser?.email || 
      `${data.first_name?.toLowerCase() || ''}${data.last_name?.toLowerCase() || ''}@example.com`;
    
    // Add email field to match User interface
    const user = {
      ...data,
      email
    };
    
    return mapUser(user);
  } catch (error) {
    console.error("Error fetching client details:", error);
    throw error;
  }
};

export const fetchClientFolders = async (clientId: string) => {
  try {
    // Get folders without trying to join with profiles
    const { data, error } = await supabase
      .from("folders")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        created_at
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Fetch agent names separately
    const enhancedData = await Promise.all(data.map(async (folder) => {
      const { data: agentData, error: agentError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", folder.agent_id)
        .single();
      
      return {
        ...folder,
        profiles: agentError ? null : {
          first_name: agentData?.first_name || '',
          last_name: agentData?.last_name || ''
        }
      };
    }));
    
    return enhancedData;
  } catch (error) {
    console.error("Error fetching client folders:", error);
    throw error;
  }
};

export const fetchClientQuotes = async (clientId: string) => {
  try {
    // Get quotes without trying to join with profiles
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        agent_id
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Fetch agent names separately
    const enhancedData = await Promise.all(data.map(async (quote) => {
      const { data: agentData, error: agentError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", quote.agent_id)
        .single();
      
      return {
        ...quote,
        profiles: agentError ? null : {
          first_name: agentData?.first_name || '',
          last_name: agentData?.last_name || ''
        }
      };
    }));
    
    return enhancedData;
  } catch (error) {
    console.error("Error fetching client quotes:", error);
    throw error;
  }
};
