import type { ReactNode } from 'react'

type AlertVariant = 'error' | 'success'

interface AlertProps {
  variant: AlertVariant
  children: ReactNode
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400',
}

function Alert({ variant, children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  )
}

export default Alert
