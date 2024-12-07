export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;

    switch (req.method) {
      case 'POST': {
        const { shopId, keyword, tag, fromPage = '0', toPage = '1', mostLiked } = req.body;

        if (mostLiked) {
          const result = await pool.query(
            `SELECT 
              p.*,
              COUNT(ci.id) AS cart_count,
              s.name as shop_name 
             FROM products p 
             LEFT JOIN cart_items ci ON ci.product_id = p.id
             LEFT JOIN shops s ON s.id = p.shop_id
             GROUP BY p.id, s.id
             ORDER BY cart_count DESC, p.created_at DESC
             LIMIT 10`
          );
          return res.json({ data: result.rows });
        }

        let query = 'SELECT p.*, s.name as shop_name FROM products p LEFT JOIN shops s ON s.id = p.shop_id WHERE 1=1';
        const params: any[] = [];
        let paramCount = 1;

        if (shopId) {
          query += ` AND p.shop_id = $${paramCount}`;
          params.push(shopId);
          paramCount++;
        }

        if (keyword) {
          query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
          params.push(`%${keyword}%`);
          paramCount++;
        }

        if (tag) {
          query += ` AND $${paramCount} = ANY(p.tags)`;
          params.push(tag);
          paramCount++;
        }

        const pageSize = 10;
        const offset = parseInt(fromPage as string) * pageSize;
        const limit = (parseInt(toPage as string) - parseInt(fromPage as string)) * pageSize;

        query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        return res.json({ data: result.rows });
      }

      case 'DELETE': {
        const { productId } = req.query;
        if (!productId) {
          return res.status(400).json({ error: 'Product ID required' });
        }

         const product = await pool.query(
          'SELECT shop_id FROM products WHERE id = $1',
          [productId]
        );

        if (product.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const permissionCheck = await pool.query(
          'SELECT * FROM store_permissions WHERE user_id = $1 AND shop_id = $2',
          [userId, product.rows[0].shop_id]
        );

        if (permissionCheck.rows.length === 0) {
          return res.status(403).json({ error: 'Not authorized to delete this product' });
        }

        await pool.query('DELETE FROM products WHERE id = $1', [productId]);
        
         const mostLiked = await pool.query(
          `SELECT 
            p.*,
            COUNT(ci.id) AS cart_count,
            s.name as shop_name 
           FROM products p 
           LEFT JOIN cart_items ci ON ci.product_id = p.id
           LEFT JOIN shops s ON s.id = p.shop_id
           GROUP BY p.id, s.id
           ORDER BY cart_count DESC, p.created_at DESC
           LIMIT 100`
        );

        await pool.query(
          'UPDATE market SET most_liked = $1, updated_at = NOW()',
          [JSON.stringify(mostLiked.rows)]
        );

        return res.json({ message: 'Product deleted successfully' });
      }

      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in products handler:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}

