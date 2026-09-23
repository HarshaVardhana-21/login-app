import type { AuthResponse, LoginCredentials, RegisterData } from '../types.ts'

const MOCK_LATENCY_MS = 1000
const MOCK_TAKEN_EMAIL = 'taken@example.com'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock login request. Replace the body with a real API call, e.g.
 * `fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })`.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(MOCK_LATENCY_MS)

  if (credentials.password === 'wrongpassword') {
    throw new Error('Invalid email or password.')
  }

  return {
    user: {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
    },
    token: 'mock-jwt-token',
  }
}

/**
 * Mock registration request. Replace the body with a real API call, e.g.
 * `fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })`.
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  await delay(MOCK_LATENCY_MS)

  if (data.email.toLowerCase() === MOCK_TAKEN_EMAIL) {
    throw new Error('An account with this email already exists.')
  }

  return {
    user: {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.fullName,
    },
    token: 'mock-jwt-token',
  }
}
