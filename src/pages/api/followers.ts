import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'


if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: 'handy35l',
      clientEmail: 'firebase-adminsdk-fr9rc@handy35l.iam.gserviceaccount.com',
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvPS9aSWbXdatQ
kiewXkKd5mhXR3eColTqkfH6EwqTjmGwaifzZhDkfRfch2ZEn7Px1hbEPLpJys2o
MNOzzR9wAo6qE2L3SpXZMNg5VbcCujTIB3EX8sWyA2RoeI2/809TuuKOpp8L0h+X
lb0FlBSIMopc9NtOfzV2PcxmDLIqNKaLYa3sjAvxFR1Us5qCYZnPtD/RG7eBjz6N
rk6yNbJDZ63EFPwp7RK4wTHnQQ4cUROvt2dDQ6klXHCLIKj7poBPMOv2bwWLTa5R
pqaBYkCw7pHJ/82QfRLVxgZWBOXbZXS6uF5bvJ+lJ0v7/cV3cNMdDRnBQPfPLnNM
/FYhJAH9AgMBAAECggEAFaT+SA3YasTxMcy3o8BkxImMujkM0SEZUXbQ10VKUWLs
/IQEJrtk2z/7NkUwE8pRCM4bdkYU8V/gCoXrZCIyH5zlP6sQ1oALJa4zitNkPS1A
LzPCG4XkNsJWANRhF8Qm+G3VJW79ppFfzxKS7BE3/wGVFvm0a8vpD89+w10OlYlC
X/m93bmJS95l9B3h/y2D9AHJiTBfISeqAiqNdUJc99aI+rqidsv2qS0NMjzEjlch
P5HV9Bkq4+2Bwn0uUOyawWAl9dcIuKh0GsFWutblgjfb+SzAoBiC/QXxpgsLCOZI
6kZo02FcolpRBvrfoS2LKIcUM62f/KMSigAxqgwx4QKBgQDgGvCDzcg1Ccaa5omS
75mB/b/ye+ypMm5bZvOwmI+O7KryF89uv1X2+YtKOioj39LGJZ/7qHbdif6UO66j
pSLbIRMczfzFOPdK2zP5KYm05NfEXg8Pt94je5uUZqTsR3aNdhmoECbssON/NdkI
5Tei7cv2xEdjRR1yZU7i1wK7YQKBgQDILdnbjkV+xDZMRXOcSDtvTaRFxmfid63G
AYMGJ2FMT6Uneccv1sBlkG4JSOrFvLR1aaw5pYBZX3CPpHrr8oJb1V7gNl6cI9ew
UFVMLR+zQRVpqoESEcuYZ6X17qAqB6P9FG2oaRHOAMAjm6pwBSsgw9K/rRo6cCXC
k6xKchHIHQKBgQC6Y02EoeMQ0bef33uufJ6U8eHyIEWeF3aXiJHHX6uOeKJYxZrd
hj9OMRA7RRMFUUOxT1u2588sxHe6+8RtEIxj6idGPsArnAx48sVQRs7kZ6xZAs3O
CeO0aTrle1VRusIMN5xxHjXxh9E+XR/MeTADz3ljHK4vDy3FliK9IYyBIQKBgBLB
GPQU9DXYNC4ZI6e0rLzUzVssJ3d0NveiFKBy+A6qN5LnOd4lhIj/aw+7oSM9drq5
V8Ve2BOHeYg7pLiOU+A+sVDYRyzhvsdp/1PPtnSY2GS58LW8rRJuQ4IzBRZq+NYx
H8TzcxOVxmqPnvw3v76mGgyTLy3ia+c65p1i6n+RAoGAUOqKgL5azbcHyXgDKmsf
NdPYknxtx5eXisyPXhM1va+w4qAol5/1Nm9xuMaoHyXs91jfbLcdOQIDZuTUsCld
gnb+F1cjIQObzwE7iKd4n+Fo48wBUJs6MAnnXkFnB0CK4uasbzps4F2FzW8ZPAjL
dbDeKKJ0oolY/WW0jdFy9PE= 
-----END PRIVATE KEY-----`,
    }),
  })
}

const adminAuth = getAuth()
const pool = new Pool({
  user: 'postgres',
  password: 'gg',
  host: 'localhost',
  port: 5432,
  database: 'handy'
})

// auth function to verify token
async function verifyAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) {
    throw new Error('No token provided')
  }
  return await adminAuth.verifyIdToken(token)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // verify auth token
    const decodedToken = await verifyAuth(req)
    const userId = decodedToken.uid

    switch (req.method) {
      case 'GET':
        if (req.query.shopId) {
          const { shopId, fromPage = '0', toPage = '1' } = req.query
          const pageSize = 10
          const offset = parseInt(fromPage as string) * pageSize
          const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize

          // fetch followers
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
          )

          // count followers
          const countResult = await pool.query(
            'SELECT COUNT(*) FROM shop_followers WHERE shop_id = $1',
            [shopId]
          )

          return res.json({
            data: followers.rows,
            total: parseInt(countResult.rows[0].count)
          })
        } else {
          // fetch followed shops
          const { fromPage = '0', toPage = '1' } = req.query
          const pageSize = 10
          const offset = parseInt(fromPage as string) * pageSize
          const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize

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
          )

          return res.json({ data: followedShops.rows })
        }

      case 'POST':
        const { shopId } = req.body
        if (!shopId) {
          return res.status(400).json({ error: 'Shop ID required' })
        }

        // check shop
        const shopCheck = await pool.query(
          'SELECT id FROM shops WHERE id = $1',
          [shopId]
        )
        if (shopCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Shop not found' })
        }

        // follow shop
        await pool.query(
          `INSERT INTO shop_followers (shop_id, user_id, created_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (shop_id, user_id) DO NOTHING`,
          [shopId, userId]
        )

        return res.json({ message: 'Shop followed successfully' })

      case 'DELETE':
        const unfollowShopId = req.query.shopId
        if (!unfollowShopId) {
          return res.status(400).json({ error: 'Shop ID required' })
        }

        // unfollow shop
        await pool.query(
          'DELETE FROM shop_followers WHERE shop_id = $1 AND user_id = $2',
          [unfollowShopId, userId]
        )

        return res.json({ message: 'Shop unfollowed successfully' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process request' })
  }
}


