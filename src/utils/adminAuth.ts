import { Pool } from 'pg';
import type { AdminRole, AdminAuthResponse } from '@/types/admin';

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
): Promise<AdminAuthResponse> {
  try {
    const userResult = await pool.query<{ role: AdminRole }>(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].role === 'REGULAR') {
      return { isAuthorized: false };
    }

    const role = userResult.rows[0].role;

    if (role === 'WEB_ADMIN') {
      return { isAuthorized: true, role: 'WEB_ADMIN' };
    }

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
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return { isAuthorized: false };
  }
}
