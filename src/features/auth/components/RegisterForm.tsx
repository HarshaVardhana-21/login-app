import Alert from '../../../components/ui/Alert.tsx'
import Button from '../../../components/ui/Button.tsx'
import Checkbox from '../../../components/ui/Checkbox.tsx'
import Input from '../../../components/ui/Input.tsx'
import PasswordInput from '../../../components/ui/PasswordInput.tsx'
import { useRegisterForm } from '../hooks/useRegisterForm.ts'
import type { AuthUser } from '../types.ts'

interface RegisterFormProps {
  onSuccess?: (user: AuthUser) => void
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } =
    useRegisterForm(onSuccess)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <Input
        label="Full name"
        name="fullName"
        autoComplete="name"
        placeholder="Jane Doe"
        value={values.fullName}
        error={errors.fullName}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={values.password}
        error={errors.password}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <Checkbox
        name="acceptTerms"
        checked={values.acceptTerms}
        error={errors.acceptTerms}
        onChange={handleChange}
        disabled={isSubmitting}
        label={
          <>
            I agree to the{' '}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Privacy Policy
            </a>
          </>
        }
      />

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}

export default RegisterForm
