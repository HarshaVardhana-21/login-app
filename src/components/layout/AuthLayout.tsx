import type { ReactNode } from 'react'
import ThemeToggle from '../ui/ThemeToggle.tsx'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-md">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          {children}
        </section>

        {footer && (
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div>
        )}
      </div>
    </main>
  )
}

export default AuthLayout
