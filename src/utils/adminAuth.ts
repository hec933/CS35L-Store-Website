import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',     
  password: 'gg',    
  host: 'localhost',     
  port: 5432,           
  database: 'handy'     
});

export async function checkAdminAuth(
  userId: string,
  shopId?: string
): Promise<{ 
  isAuthorized: boolean;
  role?: 'STORE_ADMIN' | 'WEB_ADMIN';
  authorizedStores?: string[];
}> {

  //get user role
  const userResult = await pool.query(
    'SELECT role FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0 || userResult.rows[0].role === 'REGULAR') {
    return { isAuthorized: false };
  }

  const role = userResult.rows[0].role;

  //web admins do it all (can change all stores)
  if (role === 'WEB_ADMIN') {
    return { isAuthorized: true, role: 'WEB_ADMIN' };
  }

  //store admins can only change certain stors
  if (role === 'STORE_ADMIN') {
    const storeResult = await pool.query(
      'SELECT shop_id FROM store_permissions WHERE user_id = $1',
      [userId]
    );
    
    const authorizedStores = storeResult.rows.map(row => row.shop_id);
    //check permission on this store
    if (shopId) {
      return {
        isAuthorized: authorizedStores.includes(shopId),
        role: 'STORE_ADMIN',
        authorizedStores
      };
    }

    return {
      isAuthorized: true,
      role: 'STORE_ADMIN',
      authorizedStores
    };
  }

  return { isAuthorized: false };
}