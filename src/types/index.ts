
export enum UserRole {
  CLIENT = 'client',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  role: UserRole;
  createdAt: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CartItem {
  offerId: string;
  offer: Offer;
  quantity: number;
}

export interface OfferPlate {
  id: string;
  name: string;
  clientId?: string;
  agentId: string;
  items: CartItem[];
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Quote {
  id: string;
  offerPlateId: string;
  clientId?: string;
  agentId: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  clientId: string;
  agentId: string;
  createdAt: string;
}
