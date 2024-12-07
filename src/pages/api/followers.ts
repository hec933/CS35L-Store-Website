export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;

    switch (req.method) {
      case 'POST': {
        const { action, shopId, fromPage = '0', toPage = '1' } = req.body;

        if (action === 'getShopFollowers' && shopId) {
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

          const countResult = await pool.query(
            'SELECT COUNT(*) FROM shop_followers WHERE shop_id = $1',
            [shopId]
          );

          return res.json({
            data: followers.rows,
            total: parseInt(countResult.rows[0].count)
          });
        }

        if (action === 'getFollowedShops') {
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

        if (action === 'follow') {
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
             VALUES (gen_random_uuid(), $1, $2, NOW())
             ON CONFLICT (shop_id, user_id) DO NOTHING`,
            [shopId, userId]
          );

          return res.json({ message: 'Shop followed successfully' });
        }

        return res.status(400).json({ error: 'Invalid action' });
      }

      case 'DELETE': {
        const { shopId } = req.query;
        if (!shopId) {
          return res.status(400).json({ error: 'Shop ID required' });
        }

        await pool.query(
          'DELETE FROM shop_followers WHERE shop_id = $1 AND user_id = $2',
          [shopId, userId]
        );

        return res.json({ message: 'Shop unfollowed successfully' });
      }

      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in followers handler:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
