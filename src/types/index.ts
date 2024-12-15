//types

export type AdminRole = 'REGULAR' | 'STORE_ADMIN' | 'WEB_ADMIN';

export type AdminInfo = {
  role: AdminRole;
  authorizedStores?: string[];
};

export type Shop = {
  id: string;
  name: string;
  imageUrl: string | null;
  introduce: string | null;
  createdAt: string;
};

export type Product = {
  id: string;
  shop_id: string;
  title: string;
  price: number;
  description: string;
  image_urls: string[];
  image_url: string;
  is_changable: boolean;
  is_used: boolean;
  tags: string[];
  created_at: string;
  created_by: string;
  purchase_by: string | null;
  address: string;
  quantity: number;
};

export type Like = {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  createdAt: string;
};

export type Review = {
  id: string;
  shopId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Follower = {
  id: string;
  shopId: string;
  userId: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
  role: 'REGULAR' | 'STORE_ADMIN' | 'WEB_ADMIN';
  authorizedStores?: string[];
  createdAt: string;
};

export type StorePermission = {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
};

export type AdminAuthResponse = {
  isAuthorized: boolean;
  role?: AdminRole;
  authorizedStores?: string[];
};

export type AdminApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
