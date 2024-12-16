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
        if (!token) {
          reject(new Error('Failed to retrieve token: Token is null'));
          return;
        }
        resolve(token);
      } catch (error) {
        reject(new Error('Failed to get authentication token'));
      }
    });
  });
}

export async function fetchWithAuthToken(
  endpoint: string,
  method: 'POST' | 'DELETE',
  body?: any
): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No user logged in');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'DELETE')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed. Endpoint: ${endpoint}, Method: ${method}, Error: ${
          errorData.error || 'Unknown error'
        }`
      );
    }

    return response.json();
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}
