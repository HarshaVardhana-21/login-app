export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

/** Router state passed to the login page after a successful registration. */
export interface LoginLocationState {
  registeredEmail?: string
}
