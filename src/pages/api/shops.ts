import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "handy35l",
      clientEmail: "firebase-adminsdk-fr9rc@handy35l.iam.gserviceaccount.com",
      privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...REDACTED...PE=\n-----END PRIVATE KEY-----`,
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
    const userId = req.headers.authorization
      ? (await verifyAuth(req)).uid
      : null;

    switch (req.method) {
      case 'GET': {
        if (req.query.id) {
          // Fetch a single shop by ID
          const shopId = req.query.id as string;
          const shopResult = await pool.query('SELECT * FROM shops WHERE id = $1', [shopId]);

          if (shopResult.rows.length === 0) {
            return res.status(404).json({ error: 'Shop not found' });
          }

          const [productCount, followerCount] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM products WHERE shop_id = $1', [shopId]),
            pool.query('SELECT COUNT(*) FROM shop_followers WHERE shop_id = $1', [shopId]),
          ]);

          return res.json({
            data: {
              ...shopResult.rows[0],
              productCount: parseInt(productCount.rows[0].count),
              followerCount: parseInt(followerCount.rows[0].count),
            },
          });
        } else {
          // Fetch a list of shops
          const page = parseInt(req.query.page as string) || 0;
          const pageSize = 10;
          const shopsResult = await pool.query(
            'SELECT * FROM shops ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [pageSize, page * pageSize],
          );

          return res.json({ data: shopsResult.rows });
        }
      }

      case 'POST': {
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, imageUrl, introduce } = req.body;

        const result = await pool.query(
          `INSERT INTO shops (id, name, image_url, introduce, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING *`,
          [userId, name, imageUrl, introduce],
        );

        return res.json({
          message: 'Shop created successfully',
          data: result.rows[0],
        });
      }

      case 'PUT': {
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const shopId = req.query.id as string;
        if (!shopId) {
          return res.status(400).json({ error: 'Shop ID required' });
        }

        const shop = await pool.query('SELECT id FROM shops WHERE id = $1', [shopId]);
        if (shop.rows.length === 0) {
          return res.status(404).json({ error: 'Shop not found' });
        }

        if (shop.rows[0].id !== userId) {
          return res.status(403).json({ error: 'Not authorized to update this shop' });
        }

        const { name, imageUrl, introduce } = req.body;

        const updateResult = await pool.query(
          `UPDATE shops 
           SET name = COALESCE($1, name),
               image_url = COALESCE($2, image_url),
               introduce = COALESCE($3, introduce)
           WHERE id = $4
           RETURNING *`,
          [name, imageUrl, introduce, shopId],
        );

        return res.json({
          message: 'Shop updated successfully',
          data: updateResult.rows[0],
        });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling shops:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
