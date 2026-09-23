import { Link, useNavigate } from 'react-router'
import AuthLayout from '../components/layout/AuthLayout.tsx'
import { ROUTES } from '../constants/routes.ts'
import RegisterForm from '../features/auth/components/RegisterForm.tsx'
import type { AuthUser, LoginLocationState } from '../features/auth/types.ts'

function RegisterPage() {
  const navigate = useNavigate()

  const handleSuccess = (user: AuthUser) => {
    const state: LoginLocationState = { registeredEmail: user.email }
    navigate(ROUTES.LOGIN, { state })
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started in less than a minute"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm onSuccess={handleSuccess} />
    </AuthLayout>
  )
}

export default RegisterPage
