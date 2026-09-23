import { useForm } from '../../../hooks/useForm.ts'
import { register } from '../services/authService.ts'
import type { AuthUser, RegisterData } from '../types.ts'
import { validateRegisterForm } from '../utils/validation.ts'

const INITIAL_VALUES: RegisterData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
}

export function useRegisterForm(onSuccess?: (user: AuthUser) => void) {
  return useForm({
    initialValues: INITIAL_VALUES,
    validate: validateRegisterForm,
    onSubmit: (values) =>
      register({ ...values, fullName: values.fullName.trim(), email: values.email.trim() }),
    onSuccess: ({ user }) => onSuccess?.(user),
  })
}
