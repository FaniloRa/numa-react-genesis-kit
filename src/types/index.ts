
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
  hasExtras?: boolean;  // Add this line to resolve the TypeScript error
}
