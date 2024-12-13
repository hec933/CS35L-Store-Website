import type { NextApiRequest, NextApiResponse } from 'next'
import { adminAuth } from '@/utils/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: 'Missing ID token' });
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;
        return res.status(200).json({ message: 'Token verified', user: { uid, email, name } });
    } catch (error) {
        console.error('Error verifying ID token:', error);
        return res.status(401).json({ error: 'Invalid ID token' });
    }
}