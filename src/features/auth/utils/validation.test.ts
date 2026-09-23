import { describe, expect, it } from 'vitest'
import type { LoginCredentials, RegisterData } from '../types.ts'
import { validateLoginForm, validateRegisterForm } from './validation.ts'

const validLogin: LoginCredentials = {
  email: 'user@example.com',
  password: 'password1',
  rememberMe: false,
}

const validRegister: RegisterData = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
  acceptTerms: true,
}

describe('validateLoginForm', () => {
  it('returns no errors for valid credentials', () => {
    const errors = validateLoginForm(validLogin)
    expect(Object.values(errors).some(Boolean)).toBe(false)
  })

  it('requires an email', () => {
    expect(validateLoginForm({ ...validLogin, email: '   ' }).email).toBe('Email is required.')
  })

  it.each(['plainaddress', 'user@', 'user@domain', 'user name@example.com'])(
    'rejects malformed email %j',
    (email) => {
      expect(validateLoginForm({ ...validLogin, email }).email).toBe('Enter a valid email address.')
    },
  )

  it('accepts an email with surrounding whitespace', () => {
    expect(validateLoginForm({ ...validLogin, email: '  user@example.com  ' }).email).toBeUndefined()
  })

  it('requires a password', () => {
    expect(validateLoginForm({ ...validLogin, password: '' }).password).toBe('Password is required.')
  })

  it('requires a password of at least 8 characters', () => {
    expect(validateLoginForm({ ...validLogin, password: 'short' }).password).toBe(
      'Password must be at least 8 characters.',
    )
    expect(validateLoginForm({ ...validLogin, password: '12345678' }).password).toBeUndefined()
  })
})

describe('validateRegisterForm', () => {
  it('returns no errors for valid data', () => {
    const errors = validateRegisterForm(validRegister)
    expect(Object.values(errors).some(Boolean)).toBe(false)
  })

  it('requires a full name', () => {
    expect(validateRegisterForm({ ...validRegister, fullName: '  ' }).fullName).toBe(
      'Full name is required.',
    )
  })

  it('requires a name of at least 2 characters after trimming', () => {
    expect(validateRegisterForm({ ...validRegister, fullName: ' J ' }).fullName).toBe(
      'Name must be at least 2 characters.',
    )
  })

  it('validates the email', () => {
    expect(validateRegisterForm({ ...validRegister, email: 'nope' }).email).toBe(
      'Enter a valid email address.',
    )
  })

  it.each([
    ['letters only', 'abcdefgh'],
    ['digits only', '12345678'],
  ])('requires a letter and a number (%s)', (_, password) => {
    expect(
      validateRegisterForm({ ...validRegister, password, confirmPassword: password }).password,
    ).toBe('Password must contain at least one letter and one number.')
  })

  it('reports the length error before the strength error', () => {
    expect(validateRegisterForm({ ...validRegister, password: 'abc' }).password).toBe(
      'Password must be at least 8 characters.',
    )
  })

  it('requires password confirmation', () => {
    expect(validateRegisterForm({ ...validRegister, confirmPassword: '' }).confirmPassword).toBe(
      'Please confirm your password.',
    )
  })

  it('requires matching passwords', () => {
    expect(
      validateRegisterForm({ ...validRegister, confirmPassword: 'secret124' }).confirmPassword,
    ).toBe('Passwords do not match.')
  })

  it('requires accepting the terms', () => {
    expect(validateRegisterForm({ ...validRegister, acceptTerms: false }).acceptTerms).toBe(
      'You must accept the terms to continue.',
    )
  })
})
