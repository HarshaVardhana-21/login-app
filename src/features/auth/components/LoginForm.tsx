import Alert from '../../../components/ui/Alert.tsx'
import Button from '../../../components/ui/Button.tsx'
import Checkbox from '../../../components/ui/Checkbox.tsx'
import Input from '../../../components/ui/Input.tsx'
import PasswordInput from '../../../components/ui/PasswordInput.tsx'
import { useLoginForm } from '../hooks/useLoginForm.ts'
import type { AuthUser } from '../types.ts'

interface LoginFormProps {
  initialEmail?: string
  onSuccess?: (user: AuthUser) => void
}

function LoginForm({ initialEmail, onSuccess }: LoginFormProps) {
  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } =
    useLoginForm(initialEmail, onSuccess)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError && <Alert variant="error">{submitError}</Alert>}

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
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        error={errors.password}
        onChange={handleChange}
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={values.rememberMe}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

export default LoginForm
