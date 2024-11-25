export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const { productId, quantity } = req.body;

    // Read from db
    const currentCart = await pool.query(
      'SELECT cart FROM users WHERE id = $1',
      [uid]
    );

    // Cart is a single row JSONB, or init to empty
    const cart = currentCart.rows[0].cart || {};

    if (quantity > 0) {
      // Add or update product quantity
      cart[productId] = quantity;
    } else {
      // Remove product if quantity is 0
      delete cart[productId];
    }

    // Write to db
    const result = await pool.query(
      'UPDATE users SET cart = $1 WHERE id = $2 RETURNING cart',
      [JSON.stringify(cart), uid]
    );

    return res.json({
      message: 'Cart updated',
      cart: result.rows[0].cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Cart write error' });
  }
}