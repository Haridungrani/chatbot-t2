import { getToken } from './auth';

const API_URL = 'http://localhost:8000/';

interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Helper function to make authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(`${response.status}: ${error.detail || 'Request failed'}`);
  }
  
  return response.json();
}

// API functions
export const api = {
  // Signup
  signup: async (email: string, username: string, password: string): Promise<AuthResponse> => {
    return fetchWithAuth('api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  },
  
  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return fetchWithAuth('api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Get current user
  me: async (): Promise<User> => {
    return fetchWithAuth('api/auth/me');
  },
};

export type { User, AuthResponse };
