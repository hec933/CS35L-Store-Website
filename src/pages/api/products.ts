import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
    console.log('Initializing Firebase Admin SDK');
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
    database: 'handy',
});

async function verifyAuth(req: NextApiRequest) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    console.log('Verifying token...');
    if (!token) {
        console.error('No token provided in request');
        throw new Error('No token provided');
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Token verified, UID:', decodedToken.uid);

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decodedToken.uid]);
    if (userResult.rows.length === 0) {
        console.error('User not found for UID:', decodedToken.uid);
        throw new Error('User not found');
    }

    console.log('User found:', userResult.rows[0]);
    return userResult.rows[0];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('Handling request:', req.method);
        const user = await verifyAuth(req);

        if (req.method === 'POST') {
            const { action } = req.body;
            console.log(`Action requested: ${action}`, { user });

            if (action === 'add') {
                console.log('Adding a product...');
                const {
                    shopId, title, price, address,
                    description, imageUrls, isChangable,
                    isUsed, tags
                } = req.body;

                if (!shopId) {
                    console.error('Shop ID is missing');
                    return res.status(400).json({ error: 'Shop ID is required' });
                }

                const isWebAdmin = user.role === 'WEB_ADMIN';
                const hasStorePermission = await pool.query(
                    'SELECT * FROM store_permissions WHERE user_id = $1 AND shop_id = $2',
                    [user.id, shopId]
                );

                if (!isWebAdmin && hasStorePermission.rows.length === 0) {
                    console.error('User unauthorized for shop', shopId);
                    return res.status(403).json({ error: 'User not authorized for this shop' });
                }

                const productId = `prod_${Date.now()}`;
                await pool.query(
                    `INSERT INTO products (id, shop_id, title, price, address, description, image_urls, is_changable, is_used, tags, created_by)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        productId, shopId, title, price, address,
                        description, imageUrls, isChangable, isUsed, tags, user.id
                    ]
                );

                console.log('Product added:', { id: productId, title });
                return res.json({ message: 'Product added successfully', data: { id: productId, title } });
            }

            if (action === 'fetch') {
                console.log('Fetching products...');
                const { shopId } = req.body;

                if (!shopId) {
                    console.error('Shop ID is missing');
                    return res.status(400).json({ error: 'Shop ID is required' });
                }

                const isWebAdmin = user.role === 'WEB_ADMIN';
                const hasStorePermission = await pool.query(
                    'SELECT * FROM store_permissions WHERE user_id = $1 AND shop_id = $2',
                    [user.id, shopId]
                );

                if (!isWebAdmin && hasStorePermission.rows.length === 0) {
                    console.error('User unauthorized for shop', shopId);
                    return res.status(403).json({ error: 'User not authorized for this shop' });
                }

                const products = await pool.query(
                    'SELECT id, title, price, address, description, image_urls, is_changable, is_used, tags FROM products WHERE shop_id = $1',
                    [shopId]
                );

                console.log('Products fetched:', products.rows.length);
                return res.json({ data: products.rows });
            }

            console.warn('Invalid action provided:', action);
            return res.status(400).json({ error: 'Invalid action' });
        }

        console.warn('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in handler:', error instanceof Error ? error.message : error);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
