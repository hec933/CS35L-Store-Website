import { getAuth } from 'firebase/auth';

export async function getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user logged in');
    }
    try {
        const token = await user.getIdToken();
        return token;
    } catch (error) {
        throw new Error('Failed to get authentication token');
    }
}

export async function fetchWithAuthToken(
    endpoint: string,
    method: 'POST' | 'DELETE' = 'POST',  // Changed this line
    body?: any
): Promise<any> {
    try {
        const token = await getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const options: RequestInit = {
            method,
            headers,
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed.');
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}
