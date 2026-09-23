import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import AuthLayout from '../components/layout/AuthLayout.tsx'
import Alert from '../components/ui/Alert.tsx'
import { ROUTES } from '../constants/routes.ts'
import LoginForm from '../features/auth/components/LoginForm.tsx'
import type { AuthUser, LoginLocationState } from '../features/auth/types.ts'

function LoginPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const { registeredEmail } = (useLocation().state ?? {}) as LoginLocationState

  if (user) {
    return (
      <AuthLayout title={`Hello, ${user.name}!`} subtitle="You have signed in successfully.">
        <div className="text-center">
          <button
            type="button"
            onClick={() => setUser(null)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign out
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up
          </Link>
        </>
      }
    >
      {registeredEmail && (
        <div className="mb-5">
          <Alert variant="success">Account created! Sign in to continue.</Alert>
        </div>
      )}
      <LoginForm initialEmail={registeredEmail} onSuccess={setUser} />
    </AuthLayout>
  )
}

export default LoginPage
