import { auth } from './firebaseClient'

export async function getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            
            if (!user) {
                reject(new Error('No user logged in'));
                return;
            }
            
            try {
                const token = await user.getIdToken();
                resolve(token);
            } catch (error) {
                reject(new Error('Failed to get authentication token'));
            }
        });
    });
}

export async function fetchWithAuthToken(
    endpoint: string,
    method: 'POST' | 'DELETE' = 'POST',
    body: any = {}
): Promise<any> {
    try {
        const token = await getAuthToken()
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
        const options: RequestInit = {
            method,
            headers,
            body: JSON.stringify(body)
        }
        
        const response = await fetch(endpoint, options)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'API request failed.')
        }
        return response.json()
    } catch (error) {
         console.error('Auth error:', error)
        return null
    }
}