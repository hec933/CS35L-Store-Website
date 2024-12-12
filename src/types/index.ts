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
  shopId: string;
  title: string;
  price: number;
  description: string;
  imageUrls: string[];
  isChangable: boolean;
  isUsed: boolean;
  tags: string[];
  createdAt: string;
  createdBy: string;
};

export type StoreAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type StorePermission = {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
};

//from admin portal
export type AdminAuthResponse = {
  isAuthorized: boolean;
  role?: AdminRole;
  authorizedStores?: string[];
};

//typed response for internal api use
export type AdminApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

