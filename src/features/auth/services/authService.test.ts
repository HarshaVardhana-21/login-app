import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { login, register } from './authService.ts'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

async function settle<T>(promise: Promise<T>) {
  await vi.runAllTimersAsync()
  return promise
}

describe('login', () => {
  it('resolves with a user derived from the email', async () => {
    const response = await settle(
      login({ email: 'jane@example.com', password: 'password1', rememberMe: false }),
    )
    expect(response.token).toBe('mock-jwt-token')
    expect(response.user).toMatchObject({ email: 'jane@example.com', name: 'jane' })
    expect(response.user.id).toEqual(expect.any(String))
  })

  it('rejects the known wrong password', async () => {
    const promise = login({ email: 'jane@example.com', password: 'wrongpassword', rememberMe: false })
    const assertion = expect(promise).rejects.toThrow('Invalid email or password.')
    await vi.runAllTimersAsync()
    await assertion
  })
})

describe('register', () => {
  const data = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
    acceptTerms: true,
  }

  it('resolves with the registered user', async () => {
    const response = await settle(register(data))
    expect(response.user).toMatchObject({ email: 'jane@example.com', name: 'Jane Doe' })
  })

  it('rejects the taken email case-insensitively', async () => {
    const promise = register({ ...data, email: 'Taken@Example.com' })
    const assertion = expect(promise).rejects.toThrow('An account with this email already exists.')
    await vi.runAllTimersAsync()
    await assertion
  })
})
