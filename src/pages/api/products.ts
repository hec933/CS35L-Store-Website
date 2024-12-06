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
    //auth
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const productResult = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [req.query.id]
          );
          
          if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
          }
          //get one product
          return res.json({ data: productResult.rows[0] });
        }
        
        //list products
        const {
          shopId,
          keyword,
          tag,
          fromPage = '0',
          toPage = '1'
        } = req.query;

        const pageSize = 10;
        const offset = parseInt(fromPage as string) * pageSize;
        const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params: any[] = [];
        let paramCount = 1;

        if (shopId) {
          query += ` AND shop_id = $${paramCount}`;
          params.push(shopId);
          paramCount++;
        }

        if (keyword) {
          query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
          params.push(`%${keyword}%`);
          paramCount++;
        }

        if (tag) {
          query += ` AND $${paramCount} = ANY(tags)`;
          params.push(tag);
          paramCount++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const productsResult = await pool.query(query, params);
        return res.json({ data: productsResult.rows });

    //new product
    case 'POST':
        const {
          title,
          price,
          address,
          description,
          imageUrls,
          isChangable,
          isUsed,
          tags,
          shopId: productShopId
        } = req.body;

        const shopCheck = await pool.query(
          'SELECT id FROM shops WHERE id = $1',
          [productShopId]
        );
        if (shopCheck.rows.length === 0 || shopCheck.rows[0].id !== userId) {
          return res.status(403).json({ error: 'Not authorized to create products for this shop' });
        }
        const insertResult = await pool.query(
          `INSERT INTO products (
            id,
            shop_id,
            title,
            price,
            address,
            description,
            image_urls,
            is_changable,
            is_used,
            tags,
            created_by,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          RETURNING *`,
          [
            userId,
            productShopId,
            title,
            price,
            address,
            description,
            imageUrls,
            isChangable,
            isUsed,
            tags,
            userId
          ]
        );
        return res.json({
          message: 'Product created successfully',
          data: insertResult.rows[0]
        });

      case 'PUT':
        const productId = req.query.id;
        if (!productId) {
          return res.status(400).json({ error: 'Product ID required' });
        }
        const product = await pool.query(
          'SELECT created_by FROM products WHERE id = $1',
          [productId]
        );
        if (product.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        if (product.rows[0].created_by !== userId) {
          return res.status(403).json({ error: 'Not authorized to update this product' });
        }
        const updateResult = await pool.query(
          `UPDATE products 
           SET title = COALESCE($1, title),
               price = COALESCE($2, price),
               address = COALESCE($3, address),
               description = COALESCE($4, description),
               image_urls = COALESCE($5, image_urls),
               is_changable = COALESCE($6, is_changable),
               is_used = COALESCE($7, is_used),
               tags = COALESCE($8, tags),
               purchase_by = COALESCE($9, purchase_by)
           WHERE id = $10
           RETURNING *`,
          [
            req.body.title,
            req.body.price,
            req.body.address,
            req.body.description,
            req.body.imageUrls,
            req.body.isChangable,
            req.body.isUsed,
            req.body.tags,
            req.body.purchaseBy,
            productId
          ]
        );
        return res.json({
          message: 'Product updated successfully',
          data: updateResult.rows[0]
        });
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling product:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}