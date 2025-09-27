// Types pour l'application boutique

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  videos: string[];
  prices: ProductPrice[];
  categoryId: string;
  farmId?: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPrice {
  id: string;
  productId: string;
  label: string; // ex: "500g", "1kg", "lot de 5"
  price: number;
  originalPrice?: number; // prix barré si promotion
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Farm {
  id: string;
  name: string;
  description?: string;
  location?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  id: string;
  platform: string; // facebook, instagram, twitter, etc.
  name: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface SiteConfig {
  id: string;
  key: string; // ex: "logo_url", "site_name", "promotion_images"
  value: string;
  type: 'text' | 'image' | 'video' | 'json';
  updatedAt: Date;
}

export interface FooterContent {
  id: string;
  section: 'menu' | 'information' | 'reseaux';
  title: string;
  content: string;
  links?: FooterLink[];
  isActive: boolean;
  order: number;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface CartItem {
  product: Product;
  priceId: string;
  price: ProductPrice;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CloudflareUploadResponse {
  success: boolean;
  result?: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  errors?: string[];
}