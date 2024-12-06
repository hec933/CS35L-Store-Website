import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
//fire
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
    //auth
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;
    switch (req.method) {
    //get reviews
    case 'GET':
        const { shopId, fromPage = '0', toPage = '1' } = req.query;
        if (!shopId) {
          return res.status(400).json({ error: 'Shop ID required' });
        }
        const pageSize = 10;
        const offset = parseInt(fromPage as string) * pageSize;
        const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;
        const reviews = await pool.query(
          `SELECT 
            r.*,
            u.name as user_name
          FROM shop_reviews r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.shop_id = $1
          ORDER BY r.created_at DESC
          LIMIT $2 OFFSET $3`,
          [shopId, limit, offset]
        );
        //count shops
        const countResult = await pool.query(
          'SELECT COUNT(*) FROM shop_reviews WHERE shop_id = $1',
          [shopId]
        );

        return res.json({
          data: reviews.rows,
          total: parseInt(countResult.rows[0].count)
        });
    case 'POST':
        //new review
        const { shopId: reviewShopId, content } = req.body;
        if (!reviewShopId || !content) {
          return res.status(400).json({ error: 'Shop ID and content required' });
        }
        //check shop availability
        const shopCheck = await pool.query(
          'SELECT id FROM shops WHERE id = $1',
          [reviewShopId]
        );
        if (shopCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Shop not found' });
        }
        //create
        const result = await pool.query(
          `INSERT INTO shop_reviews (id, shop_id, user_id, content, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING *`,
          [require('crypto').randomUUID(), reviewShopId, userId, content]
        );
        return res.json({
          message: 'Review created successfully',
          data: result.rows[0]
        });
    case 'PUT':
        //update
        const reviewId = req.query.id;
        const { content: newContent } = req.body;
        if (!reviewId || !newContent) {
          return res.status(400).json({ error: 'Review ID and content required' });
        }
        const updateResult = await pool.query(
          `UPDATE shop_reviews 
           SET content = $1
           WHERE id = $2 AND user_id = $3
           RETURNING *`,
          [newContent, reviewId, userId]
        );
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Review not found or not authorized' });
        }
        return res.json({
          message: 'Review updated successfully',
          data: updateResult.rows[0]
        });
    case 'DELETE':
        const deleteId = req.query.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'Review ID required' });
        }
        const deleteResult = await pool.query(
          'DELETE FROM shop_reviews WHERE id = $1 AND user_id = $2 RETURNING *',
          [deleteId, userId]
        );
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Review not found or not authorized' });
        }
        return res.json({ message: 'Review deleted successfully' });
    default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling review:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}