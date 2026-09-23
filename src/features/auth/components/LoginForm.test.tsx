import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login } from '../services/authService.ts'
import LoginForm from './LoginForm.tsx'

vi.mock('../services/authService.ts', () => ({
  login: vi.fn(),
}))

const mockLogin = vi.mocked(login)
const user = { id: '1', email: 'jane@example.com', name: 'jane' }

beforeEach(() => {
  mockLogin.mockReset()
})

async function fillAndSubmit(email: string, password: string) {
  const ue = userEvent.setup()
  if (email) await ue.type(screen.getByLabelText('Email address'), email)
  if (password) await ue.type(screen.getByLabelText('Password'), password)
  await ue.click(screen.getByRole('button', { name: 'Sign in' }))
  return ue
}

describe('LoginForm', () => {
  it('shows validation errors and does not call login', async () => {
    render(<LoginForm />)
    await fillAndSubmit('', '')

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('prefills the email from initialEmail', () => {
    render(<LoginForm initialEmail="new@example.com" />)
    expect(screen.getByLabelText('Email address')).toHaveValue('new@example.com')
  })

  it('submits trimmed credentials and calls onSuccess', async () => {
    mockLogin.mockResolvedValue({ user, token: 't' })
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    const ue = userEvent.setup()
    await ue.click(screen.getByLabelText('Remember me'))
    await fillAndSubmit('  jane@example.com ', 'password1')

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'password1',
      rememberMe: true,
    })
    expect(onSuccess).toHaveBeenCalledWith(user)
  })

  it('shows a loading state while signing in', async () => {
    mockLogin.mockReturnValue(new Promise(() => {}))
    render(<LoginForm />)
    await fillAndSubmit('jane@example.com', 'password1')

    expect(screen.getByRole('button', { name: /Signing in/ })).toBeDisabled()
    expect(screen.getByLabelText('Email address')).toBeDisabled()
  })

  it('shows the server error in an alert', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid email or password.'))
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)
    await fillAndSubmit('jane@example.com', 'wrongpassword')

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('toggles password visibility', async () => {
    render(<LoginForm />)
    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')

    await userEvent.setup().click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })
})
