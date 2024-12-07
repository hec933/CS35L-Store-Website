import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "handy35l",
      clientEmail: "firebase-adminsdk-fr9rc@handy35l.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvPS9aSWbXdatQ\nkiewXkKd5mhXR3eColTqkfH6EwqTjmGwaifzZhDkfRfch2ZEn7Px1hbEPLpJys2o\nMNOzzR9wAo6qE2L3SpXZMNg5VbcCujTIB3EX8sWyA2RoeI2/809TuuKOpp8L0h+X\nlb0FlBSIMopc9NtOfzV2PcxmDLIqNKaLYa3sjAvxFR1Us5qCYZnPtD/RG7eBjz6N\nrk6yNbJDZ63EFPwp7RK4wTHnQQ4cUROvt2dDQ6klXHCLIKj7poBPMOv2bwWLTa5R\npqaBYkCw7pHJ/82QfRLVxgZWBOXbZXS6uF5bvJ+lJ0v7/cV3cNMdDRnBQPfPLnNM\n/FYhJAH9AgMBAAECggEAFaT+SA3YasTxMcy3o8BkxImMujkM0SEZUXbQ10VKUWLs\n/IQEJrtk2z/7NkUwE8pRCM4bdkYU8V/gCoXrZCIyH5zlP6sQ1oALJa4zitNkPS1A\nLzPCG4XkNsJWANRhF8Qm+G3VJW79ppFfzxKS7BE3/wGVFvm0a8vpD89+w10OlYlC\nX/m93bmJS95l9B3h/y2D9AHJiTBfISeqAiqNdUJc99aI+rqidsv2qS0NMjzEjlch\nP5HV9Bkq4+2Bwn0uUOyawWAl9dcIuKh0GsFWutblgjfb+SzAoBiC/QXxpgsLCOZI\n6kZo02FcolpRBvrfoS2LKIcUM62f/KMSigAxqgwx4QKBgQDgGvCDzcg1Ccaa5omS\n75mB/b/ye+ypMm5bZvOwmI+O7KryF89uv1X2+YtKOioj39LGJZ/7qHbdif6UO66j\npSLbIRMczfzFOPdK2zP5KYm05NfEXg8Pt94je5uUZqTsR3aNdhmoECbssON/NdkI\n5Tei7cv2xEdjRR1yZU7i1wK7YQKBgQDILdnbjkV+xDZMRXOcSDtvTaRFxmfid63G\nAYMGJ2FMT6Uneccv1sBlkG4JSOrFvLR1aaw5pYBZX3CPpHrr8oJb1V7gNl6cI9ew\nUFVMLR+zQRVpqoESEcuYZ6X17qAqB6P9FG2oaRHOAMAjm6pwBSsgw9K/rRo6cCXC\nk6xKchHIHQKBgQC6Y02EoeMQ0bef33uufJ6U8eHyIEWeF3aXiJHHX6uOeKJYxZrd\nhj9OMRA7RRMFUUOxT1u2588sxHe6+8RtEIxj6idGPsArnAx48sVQRs7kZ6xZAs3O\nCeO0aTrle1VRusIMN5xxHjXxh9E+XR/MeTADz3ljHK4vDy3FliK9IYyBIQKBgBLB\nGPQU9DXYNC4ZI6e0rLzUzVssJ3d0NveiFKBy+A6qN5LnOd4lhIj/aw+7oSM9drq5\nV8Ve2BOHeYg7pLiOU+A+sVDYRyzhvsdp/1PPtnSY2GS58LW8rRJuQ4IzBRZq+NYx\nH8TzcxOVxmqPnvw3v76mGgyTLy3ia+c65p1i6n+RAoGAUOqKgL5azbcHyXgDKmsf\nNdPYknxtx5eXisyPXhM1va+w4qAol5/1Nm9xuMaoHyXs91jfbLcdOQIDZuTUsCld\ngnb+F1cjIQObzwE7iKd4n+Fo48wBUJs6MAnnXkFnB0CK4uasbzps4F2FzW8ZPAjL\ndbDeKKJ0oolY/WW0jdFy9PE=\n-----END PRIVATE KEY-----\n"
    }),
  });
}
const adminAuth = getAuth();
const pool = new Pool({
  user: 'postgres',     
  password: 'gg',    
  host: 'localhost',     
  port: 5432,           
  database: 'handy'     
});

//auth
async function verifyAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  return await adminAuth.verifyIdToken(token);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;
    switch (req.method) {
    //get followers for a shop
    case 'GET':
        if (req.query.shopId) {
          const { shopId, fromPage = '0', toPage = '1' } = req.query;
          const pageSize = 10;
          const offset = parseInt(fromPage as string) * pageSize;
          const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;
          const followers = await pool.query(
            `SELECT 
              f.*,
              u.name as user_name
            FROM shop_followers f
            JOIN users u ON f.user_id = u.id
            WHERE f.shop_id = $1
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3`,
            [shopId, limit, offset]
          );

          //count followers
          const countResult = await pool.query(
            'SELECT COUNT(*) FROM shop_followers WHERE shop_id = $1',
            [shopId]
          );
          return res.json({
            data: followers.rows,
            total: parseInt(countResult.rows[0].count)
          });
        } else {
          //get a list of followed
          const { fromPage = '0', toPage = '1' } = req.query;
          const pageSize = 10;
          const offset = parseInt(fromPage as string) * pageSize;
          const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;
          const followedShops = await pool.query(
            `SELECT 
              s.*,
              f.created_at as followed_at
            FROM shops s
            JOIN shop_followers f ON s.id = f.shop_id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
          );
          return res.json({ data: followedShops.rows });
        }
    case 'POST':
        const { shopId } = req.body;
        if (!shopId) {
          return res.status(400).json({ error: 'Shop ID required' });
        }
        const shopCheck = await pool.query(
          'SELECT id FROM shops WHERE id = $1',
          [shopId]
        );
        if (shopCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Shop not found' });
        }
        await pool.query(
          `INSERT INTO shop_followers (id, shop_id, user_id, created_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (shop_id, user_id) DO NOTHING`,
          [require('crypto').randomUUID(), shopId, userId]
        );
        return res.json({ message: 'Shop followed successfully' });
    case 'DELETE':
        const unfollowShopId = req.query.shopId;
        if (!unfollowShopId) {
          return res.status(400).json({ error: 'Shop ID required' });
        }
        await pool.query(
          'DELETE FROM shop_followers WHERE shop_id = $1 AND user_id = $2',
          [unfollowShopId, userId]
        );
        return res.json({ message: 'Shop unfollowed successfully' });
    default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling followers:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}