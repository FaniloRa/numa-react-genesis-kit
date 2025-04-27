// Add to existing types file
export interface PaymentInfo {
  id: string;
  quoteId: string;
  bankName: string;
  iban: string;
  bic: string;
  createdAt: string;
}

export enum UserRole {
  CLIENT = "client",
  AGENT = "agent",
  ADMIN = "admin"
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

export interface OfferExtra {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
}

export interface SelectedExtra {
  extraId: string;
  quantity: number;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  setupFee: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  features: string[];
  extras?: OfferExtra[];
}

export interface CartItem {
  id?: string;
  offerId: string;
  offer: Offer;
  quantity: number;
  offerPlateId?: string;
  selectedExtras?: SelectedExtra[];
}

export interface OfferPlate {
  id: string;
  name: string;
  clientId?: string;
  agentId: string;
  status: string;
  createdAt: string;
  items?: CartItem[];
}

export interface Folder {
  id: string;
  name: string;
  clientId: string;
  agentId: string;
  createdAt: string;
  client?: User;
  agent?: User;
  offerPlates?: OfferPlate[];
  quotes?: Quote[];
}

export interface Quote {
  id: string;
  offerPlateId: string;
  clientId?: string;
  agentId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  client?: User;
  agent?: User;
  offerPlate?: OfferPlate;
  items?: CartItem[];
  paymentInfo?: PaymentInfo;
}

export interface LineItemType {
  offre: string;
  description: string;
  prix: number;
  quantite: number;
  montant: number;
}
