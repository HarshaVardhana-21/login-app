import { useForm } from '../../../hooks/useForm.ts'
import { login } from '../services/authService.ts'
import type { AuthUser, LoginCredentials } from '../types.ts'
import { validateLoginForm } from '../utils/validation.ts'

export function useLoginForm(initialEmail = '', onSuccess?: (user: AuthUser) => void) {
  const initialValues: LoginCredentials = { email: initialEmail, password: '', rememberMe: false }

  return useForm({
    initialValues,
    validate: validateLoginForm,
    onSubmit: (values) => login({ ...values, email: values.email.trim() }),
    onSuccess: ({ user }) => onSuccess?.(user),
  })
}
