
// Base URL for the Elysia API
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:4000/api';


interface FetchOptions extends RequestInit {
  token?: string;
}

export const api = {
  get: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },
  post: async <T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  patch: async <T>(endpoint: string, body: any, options: FetchOptions = {}): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  delete: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  }
};

async function request<T>(endpoint: string, options: FetchOptions): Promise<T> {
  const { token, headers, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${response.statusText}`);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    console.error(`Request failed: ${endpoint}`, error);
    throw error;
  }
}
