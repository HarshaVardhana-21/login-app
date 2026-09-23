import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { register } from '../services/authService.ts'
import type { RegisterData } from '../types.ts'
import RegisterForm from './RegisterForm.tsx'

vi.mock('../services/authService.ts', () => ({
  register: vi.fn(),
}))

const mockRegister = vi.mocked(register)

beforeEach(() => {
  mockRegister.mockReset()
})

async function fillForm({
  fullName = 'Jane Doe',
  email = 'jane@example.com',
  password = 'secret123',
  confirmPassword = password,
  acceptTerms = true,
}: Partial<RegisterData> = {}) {
  const ue = userEvent.setup()
  await ue.type(screen.getByLabelText('Full name'), fullName)
  await ue.type(screen.getByLabelText('Email address'), email)
  await ue.type(screen.getByLabelText('Password'), password)
  await ue.type(screen.getByLabelText('Confirm password'), confirmPassword)
  if (acceptTerms) await ue.click(screen.getByRole('checkbox'))
  await ue.click(screen.getByRole('button', { name: 'Create account' }))
}

describe('RegisterForm', () => {
  it('shows all required-field errors on an empty submit', async () => {
    render(<RegisterForm />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Create account' }))

    for (const message of [
      'Full name is required.',
      'Email is required.',
      'Password is required.',
      'Please confirm your password.',
      'You must accept the terms to continue.',
    ]) {
      expect(screen.getByText(message)).toBeInTheDocument()
    }
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('rejects mismatched passwords', async () => {
    render(<RegisterForm />)
    await fillForm({ confirmPassword: 'different1' })

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('submits trimmed data and calls onSuccess', async () => {
    const user = { id: '1', email: 'jane@example.com', name: 'Jane Doe' }
    mockRegister.mockResolvedValue({ user, token: 't' })
    const onSuccess = vi.fn()
    render(<RegisterForm onSuccess={onSuccess} />)
    await fillForm({ fullName: '  Jane Doe ', email: ' jane@example.com ' })

    expect(mockRegister).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
      acceptTerms: true,
    })
    expect(onSuccess).toHaveBeenCalledWith(user)
  })

  it('shows the server error in an alert', async () => {
    mockRegister.mockRejectedValue(new Error('An account with this email already exists.'))
    render(<RegisterForm />)
    await fillForm({ email: 'taken@example.com' })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'An account with this email already exists.',
    )
  })
})
