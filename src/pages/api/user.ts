import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg';
import { adminAuth } from '@/utils/firebaseAdmin'
import { logAuth } from '@/utils/authLogger'

const pool = new Pool({
  user: 'postgres',     
  password: 'gg',    
  host: 'localhost',     
  port: 5432,           
  database: 'handy'     
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid, email, name } = decodedToken;
    logAuth(uid, name || 'NaN', email || 'NaE');

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    
    //update user
    if (userResult.rows.length > 0) {
      const updatedUser = await pool.query(
        'UPDATE users SET lastin = NOW() WHERE id = $1 RETURNING *',
        [uid]
      );
      return res.json({
        message: 'User authenticated successfully',
        user: updatedUser.rows[0],
      });
    }

    //add user
    const newUser = await pool.query(
      `INSERT INTO users (id, name, email, prefs, firstin, lastin, role) 
       VALUES ($1, $2, $3, $4, NOW(), NOW(), 'REGULAR') 
       RETURNING *`,
      [uid, name, email, JSON.stringify({ language: 'en' })]
    );

    return res.json({
      message: 'User created successfully',
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error('Failed to process user request:', error);
    return res.status(500).json({ error: 'Failed to process user request' });
  }
}