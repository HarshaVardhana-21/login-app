import type { FormErrors } from '../../../hooks/useForm.ts'
import type { LoginCredentials, RegisterData } from '../types.ts'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const MIN_NAME_LENGTH = 2

function validateEmail(value: string): string | undefined {
  const email = value.trim()
  if (!email) return 'Email is required.'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.'
  return undefined
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required.'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return undefined
}

/** Registration requires a stronger password than the basic login check. */
function validateNewPassword(value: string): string | undefined {
  const baseError = validatePassword(value)
  if (baseError) return baseError
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return 'Password must contain at least one letter and one number.'
  }
  return undefined
}

export function validateLoginForm(values: LoginCredentials): FormErrors<LoginCredentials> {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  }
}

export function validateRegisterForm(values: RegisterData): FormErrors<RegisterData> {
  const errors: FormErrors<RegisterData> = {
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
  }

  const fullName = values.fullName.trim()
  if (!fullName) {
    errors.fullName = 'Full name is required.'
  } else if (fullName.length < MIN_NAME_LENGTH) {
    errors.fullName = `Name must be at least ${MIN_NAME_LENGTH} characters.`
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms to continue.'
  }

  return errors
}
