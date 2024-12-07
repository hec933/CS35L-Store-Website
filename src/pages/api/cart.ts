import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

//initialize firebase
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: 'handy35l',
      clientEmail: 'firebase-adminsdk-fr9rc@handy35l.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvPS9aSWbXdatQ\nkiewXkKd5mhXR3eColTqkfH6EwqTjmGwaifzZhDkfRfch2ZEn7Px1hbEPLpJys2o\nMNOzzR9wAo6qE2L3SpXZMNg5VbcCujTIB3EX8sWyA2RoeI2/809TuuKOpp8L0h+X\nlb0FlBSIMopc9NtOfzV2PcxmDLIqNKaLYa3sjAvxFR1Us5qCYZnPtD/RG7eBjz6N\nrk6yNbJDZ63EFPwp7RK4wTHnQQ4cUROvt2dDQ6klXHCLIKj7poBPMOv2bwWLTa5R\npqaBYkCw7pHJ/82QfRLVxgZWBOXbZXS6uF5bvJ+lJ0v7/cV3cNMdDRnBQPfPLnNM\n/FYhJAH9AgMBAAECggEAFaT+SA3YasTxMcy3o8BkxImMujkM0SEZUXbQ10VKUWLs\n/IQEJrtk2z/7NkUwE8pRCM4bdkYU8V/gCoXrZCIyH5zlP6sQ1oALJa4zitNkPS1A\nLzPCG4XkNsJWANRhF8Qm+G3VJW79ppFfzxKS7BE3/wGVFvm0a8vpD89+w10OlYlC\nX/m93bmJS95l9B3h/y2D9AHJiTBfISeqAiqNdUJc99aI+rqidsv2qS0NMjzEjlch\nP5HV9Bkq4+2Bwn0uUOyawWAl9dcIuKh0GsFWutblgjfb+SzAoBiC/QXxpgsLCOZI\n6kZo02FcolpRBvrfoS2LKIcUM62f/KMSigAxqgwx4QKBgQDgGvCDzcg1Ccaa5omS\n75mB/b/ye+ypMm5bZvOwmI+O7KryF89uv1X2+YtKOioj39LGJZ/7qHbdif6UO66j\npSLbIRMczfzFOPdK2zP5KYm05NfEXg8Pt94je5uUZqTsR3aNdhmoECbssON/NdkI\n5Tei7cv2xEdjRR1yZU7i1wK7YQKBgQDILdnbjkV+xDZMRXOcSDtvTaRFxmfid63G\nAYMGJ2FMT6Uneccv1sBlkG4JSOrFvLR1aaw5pYBZX3CPpHrr8oJb1V7gNl6cI9ew\nUFVMLR+zQRVpqoESEcuYZ6X17qAqB6P9FG2oaRHOAMAjm6pwBSsgw9K/rRo6cCXC\nk6xKchHIHQKBgQC6Y02EoeMQ0bef33uufJ6U8eHyIEWeF3aXiJHHX6uOeKJYxZrd\nhj9OMRA7RRMFUUOxT1u2588sxHe6+8RtEIxj6idGPsArnAx48sVQRs7kZ6xZAs3O\nCeO0aTrle1VRusIMN5xxHjXxh9E+XR/MeTADz3ljHK4vDy3FliK9IYyBIQKBgBLB\nGPQU9DXYNC4ZI6e0rLzUzVssJ3d0NveiFKBy+A6qN5LnOd4lhIj/aw+7oSM9drq5\nV8Ve2BOHeYg7pLiOU+A+sVDYRyzhvsdp/1PPtnSY2GS58LW8rRJuQ4IzBRZq+NYx\nH8TzcxOVxmqPnvw3v76mGgyTLy3ia+c65p1i6n+RAoGAUOqKgL5azbcHyXgDKmsf\nNdPYknxtx5eXisyPXhM1va+w4qAol5/1Nm9xuMaoHyXs91jfbLcdOQIDZuTUsCld\ngnb+F1cjIQObzwE7iKd4n+Fo48wBUJs6MAnnXkFnB0CK4uasbzps4F2FzW8ZPAjL\ndbDeKKJ0oolY/WW0jdFy9PE=\n-----END PRIVATE KEY-----\n',
    }),
  });
}

//firebase auth
const adminAuth = getAuth();

//database connection
const pool = new Pool({
  user: 'postgres',
  password: 'gg',
  host: 'localhost',
  port: 5432,
  database: 'handy',
});

//verify token
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
    //verify user
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;

    switch (req.method) {
      //get cart items
      case 'GET':
        const { fromPage = '0', toPage = '1' } = req.query;
        const pageSize = 10;
        const offset = parseInt(fromPage as string) * pageSize;
        const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;

        const cartItems = await pool.query(
          `SELECT 
            ci.*,
            p.title,
            p.price,
            p.image_urls,
            p.created_at as product_created_at,
            s.id as shop_id,
            s.name as shop_name
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          JOIN shops s ON p.shop_id = s.id
          WHERE ci.user_id = $1
          ORDER BY ci.created_at DESC
          LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );

        const countResult = await pool.query(
          'SELECT COUNT(*) FROM cart_items WHERE user_id = $1',
          [userId]
        );

        return res.json({
          data: cartItems.rows,
          total: parseInt(countResult.rows[0].count),
        });

      //add cart item
      case 'POST':
        const { productId, quantity = 1 } = req.body;

        const productCheck = await pool.query(
          'SELECT purchase_by FROM products WHERE id = $1',
          [productId]
        );

        if (productCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        if (productCheck.rows[0].purchase_by) {
          return res.status(400).json({ error: 'Product is already sold' });
        }

        const result = await pool.query(
          `INSERT INTO cart_items (id, user_id, product_id, quantity, created_at)
           VALUES (concat($2, '-', $3), $2, $3, $4, NOW())
           ON CONFLICT (user_id, product_id)
           DO UPDATE SET quantity = cart_items.quantity + $4
           RETURNING *`,
          [userId, productId, quantity]
        );

        return res.json({
          message: 'Item added to cart',
          data: result.rows[0],
        });

      //update cart item
      case 'PUT':
        const cartItemId = req.query.id;
        const { quantity: newQuantity } = req.body;

        if (!cartItemId) {
          return res.status(400).json({ error: 'Cart item ID required' });
        }

        const updateResult = await pool.query(
          `UPDATE cart_items 
           SET quantity = $1
           WHERE id = $2 AND user_id = $3
           RETURNING *`,
          [newQuantity, cartItemId, userId]
        );

        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Cart item not found' });
        }

        return res.json({
          message: 'Cart item updated',
          data: updateResult.rows[0],
        });

      //delete cart item
      case 'DELETE':
        const itemId = req.query.id;

        if (!itemId) {
          return res.status(400).json({ error: 'Cart item ID required' });
        }

        await pool.query(
          'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
          [itemId, userId]
        );

        return res.json({ message: 'Item removed from cart' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling cart:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}