import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase/auth';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',     
  password: 'gg',    
  host: 'localhost',     
  port: 5432,           
  database: 'handy'     
});

type AdminAuthResult = {
  isAuthorized: boolean;
  role?: 'STORE_ADMIN' | 'WEB_ADMIN';
  authorizedStores?: string[];
};


//check all auths
export async function checkAdminAuth(
  userId: string,
  shopId?: string 
): Promise<AdminAuthResult> {
  //check role
  const userResult = await pool.query(
    'SELECT role FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0 || userResult.rows[0].role === 'REGULAR') {
    return { isAuthorized: false };
  }

  //set role for web to all store
  const role = userResult.rows[0].role;
  if (role === 'WEB_ADMIN') {
    return { isAuthorized: true, role: 'WEB_ADMIN' };
  }
  //set store admin to their stores
  if (role === 'STORE_ADMIN') {
    const storeResult = await pool.query(
      'SELECT shop_id FROM store_permissions WHERE user_id = $1',
      [userId]
    );
    const authorizedStores = storeResult.rows.map(row => row.shop_id);
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

//check admin
export function withAdminAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const decodedToken = await getAuth().verifyIdToken(token);
      const userId = decodedToken.uid;
      const { isAuthorized, role, authorizedStores } = await checkAdminAuth(
        userId,
        req.query.shopId as string
      );

      if (!isAuthorized) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      //return an authorize scope
      req.admin = { role, authorizedStores };
      return handler(req, res);
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(500).json({ error: 'Admin authentication failed' });
    }
  };
}