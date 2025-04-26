
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

// Function to fetch notifications for a user
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      content: item.content,
      type: mapNotificationType(item.type),
      read: item.read,
      createdAt: item.created_at,
      link: item.link,
    }));
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw new Error(error.message);
    return true;
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Function to mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) throw new Error(error.message);
    return true;
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

// Function to create a notification
export const createNotification = async (
  userId: string,
  title: string,
  content: string,
  type: "info" | "success" | "warning" | "error",
  link?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        content,
        type,
        link
      });

    if (error) throw new Error(error.message);
    return true;
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return false;
  }
};

// Helper function to map notification type to valid enum value
const mapNotificationType = (type: string): "info" | "success" | "warning" | "error" => {
  switch (type) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "error";
    default:
      return "info";
  }
};
