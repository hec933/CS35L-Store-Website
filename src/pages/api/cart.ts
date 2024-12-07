import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: 'handy35l',
      clientEmail: 'firebase-adminsdk-fr9rc@handy35l.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvPS9aSWbXdatQ\nkiewXkKd5mhXR3eColTqkfH6EwqTjmGwaifzZhDkfRfch2ZEn7Px1hbEPLpJys2o\nMNOzzR9wAo6qE2L3SpXZMNg5VbcCujTIB3EX8sWyA2RoeI2/809TuuKOpp8L0h+X\nlb0FlBSIMopc9NtOfzV2PcxmDLIqNKaLYa3sjAvxFR1Us5qCYZnPtD/RG7eBjz6N\nrk6yNbJDZ63EFPwp7RK4wTHnQQ4cUROvt2dDQ6klXHCLIKj7poBPMOv2bwWLTa5R\npqaBYkCw7pHJ/82QfRLVxgZWBOXbZXS6uF5bvJ+lJ0v7/cV3cNMdDRnBQPfPLnNM\n/FYhJAH9AgMBAAECggEAFaT+SA3YasTxMcy3o8BkxImMujkM0SEZUXbQ10VKUWLs\n/IQEJrtk2z/7NkUwE8pRCM4bdkYU8V/gCoXrZCIyH5zlP6sQ1oALJa4zitNkPS1A\nLzPCG4XkNsJWANRhF8Qm+G3VJW79ppFfzxKS7BE3/wGVFvm0a8vpD89+w10OlYlC\nX/m93bmJS95l9B3h/y2D9AHJiTBfISeqAiqNdUJc99aI+rqidsv2qS0NMjzEjlch\nP5HV9Bkq4+2Bwn0uUOyawWAl9dcIuKh0GsFWutblgjfb+SzAoBiC/QXxpgsLCOZI\n6kZo02FcolpRBvrfoS2LKIcUM62f/KMSigAxqgwx4QKBgQDgGvCDzcg1Ccaa5omS\n75mB/b/ye+ypMm5bZvOwmI+O7KryF89uv1X2+YtKOioj39LGJZ/7qHbdif6UO66j\npSLbIRMczfzFOPdK2zP5KYm05NfEXg8Pt94je5uUZqTsR3aNdhmoECbssON/NdkI\n5Tei7cv2xEdjRR1yZU7i1wK7YQKBgQDILdnbjkV+xDZMRXOcSDtvTaRFxmfid63G\nAYMGJ2FMT6Uneccv1sBlkG4JSOrFvLR1aaw5pYBZX3CPpHrr8oJb1V7gNl6cI9ew\nUFVMLR+zQRVpqoESEcuYZ6X17qAqB6P9FG2oaRHOAMAjm6pwBSsgw9K/rRo6cCXC\nk6xKchHIHQKBgQC6Y02EoeMQ0bef33uufJ6U8eHyIEWeF3aXiJHHX6uOeKJYxZrd\nhj9OMRA7RRMFUUOxT1u2588sxHe6+8RtEIxj6idGPsArnAx48sVQRs7kZ6xZAs3O\nCeO0aTrle1VRusIMN5xxHjXxh9E+XR/MeTADz3ljHK4vDy3FliK9IYyBIQKBgBLB\nGPQU9DXYNC4ZI6e0rLzUzVssJ3d0NveiFKBy+A6qN5LnOd4lhIj/aw+7oSM9drq5\nV8Ve2BOHeYg7pLiOU+A+sVDYRyzhvsdp/1PPtnSY2GS58LW8rRJuQ4IzBRZq+NYx\nH8TzcxOVxmqPnvw3v76mGgyTLy3ia+c65p1i6n+RAoGAUOqKgL5azbcHyXgDKmsf\nNdPYknxtx5eXisyPXhM1va+w4qAol5/1Nm9xuMaoHyXs91jfbLcdOQIDZuTUsCld\ngnb+F1cjIQObzwE7iKd4n+Fo48wBUJs6MAnnXkFnB0CK4uasbzps4F2FzW8ZPAjL\ndbDeKKJ0oolY/WW0jdFy9PE=\n-----END PRIVATE KEY-----\n',
    }),
  });
}

const adminAuth = getAuth();
const pool = new Pool({
  user: 'postgres',
  password: 'gg',
  host: 'localhost',
  port: 5432,
  database: 'handy',
});

async function verifyAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  return await adminAuth.verifyIdToken(token);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;

    switch (req.method) {
      case 'POST': {
        const { action, productId, quantity } = req.body;

        if (action === 'fetch') {
          // Fetch full cart details
          const cartItems = await pool.query(
            `SELECT 
              ci.id as cart_item_id,
              ci.quantity,
              ci.created_at as added_to_cart_at,
              p.id as product_id,
              p.title,
              p.price,
              p.image_urls[1] as primary_image,
              p.shop_id,
              s.name as shop_name
             FROM cart_items ci
             JOIN products p ON p.id = ci.product_id 
             JOIN shops s ON s.id = p.shop_id
             WHERE ci.user_id = $1
             ORDER BY ci.created_at DESC`,
            [userId]
          );
          
          return res.json({
            data: cartItems.rows
          });
        }

         if (!productId || !quantity) {
          return res.status(400).json({ error: 'Product ID and quantity required' });
        }

        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
          return res.status(400).json({ error: 'Invalid quantity' });
        }

        await pool.query(
          `INSERT INTO cart_items (id, user_id, product_id, quantity, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, NOW())
           ON CONFLICT (user_id, product_id) DO UPDATE 
           SET quantity = EXCLUDED.quantity`,
          [userId, productId, quantity]
        );

        await updateMostLiked();

        return res.json({ message: 'Cart updated successfully' });
      }

      case 'DELETE': {
        const { productId } = req.query;
        if (!productId) {
          return res.status(400).json({ error: 'Product ID required' });
        }

        await pool.query(
          'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
          [userId, productId]
        );

        await updateMostLiked();

        return res.json({ message: 'Item removed from cart' });
      }

      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in cart handler:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}

async function updateMostLiked() {
  const result = await pool.query(
    `SELECT 
      p.id, 
      p.title, 
      COUNT(ci.id) AS cart_count,
      p.price,
      p.image_urls[1] as primary_image,
      p.shop_id,
      s.name as shop_name
     FROM products p
     LEFT JOIN cart_items ci ON ci.product_id = p.id
     LEFT JOIN shops s ON s.id = p.shop_id
     GROUP BY p.id, s.id, s.name
     ORDER BY cart_count DESC, p.created_at DESC
     LIMIT 100`
  );

  const mostLiked = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    cart_count: parseInt(row.cart_count, 10),
    price: row.price,
    primary_image: row.primary_image,
    shop_id: row.shop_id,
    shop_name: row.shop_name
  }));

  await pool.query(
    'UPDATE market SET most_liked = $1, updated_at = NOW()',
    [JSON.stringify(mostLiked)]
  );
}