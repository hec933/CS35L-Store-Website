import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase/auth';
import { Pool } from 'pg';


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const pool = new Pool({
  user: 'postgres',
  password: 'gg',
  host: 'localhost',
  port: 5432,
  database: 'handy'
});



// Extend NextApiRequest type
declare module 'next' {
  interface NextApiRequest {
    admin?: {
      role: 'STORE_ADMIN' | 'WEB_ADMIN';
      authorizedStores?: string[];
    };
  }
}

// Check all auths
type AdminAuthResult = {
  isAuthorized: false;
} | {
  isAuthorized: true;
  role: 'STORE_ADMIN' | 'WEB_ADMIN';
  authorizedStores?: string[];
};

export async function checkAdminAuth(userId: string, shopId?: string): Promise<AdminAuthResult> {
  const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

  if (userResult.rows.length === 0 || userResult.rows[0].role === 'REGULAR') {
    return { isAuthorized: false };
  }

  const role = userResult.rows[0].role;

  if (role === 'WEB_ADMIN') {
    return { isAuthorized: true, role: 'WEB_ADMIN' };
  }

  if (role === 'STORE_ADMIN') {
    const storeResult = await pool.query('SELECT shop_id FROM store_permissions WHERE user_id = $1', [userId]);
    const authorizedStores = storeResult.rows.map(row => row.shop_id);

    return {
      isAuthorized: true,
      role: 'STORE_ADMIN',
      authorizedStores,
    };
  }

  return { isAuthorized: false };
}

export function withAdminAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      // Use admin.auth() for token verification
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      const authResult = await checkAdminAuth(userId, req.query.shopId as string);

      if (!authResult.isAuthorized) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { role, authorizedStores } = authResult;
      req.admin = { role, authorizedStores };

      return handler(req, res);
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(500).json({ error: 'Admin authentication failed' });
    }
  };
}