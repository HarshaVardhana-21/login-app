import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  /** Element rendered inside the input on the right, e.g. a visibility toggle. */
  endAdornment?: ReactNode
}

function Input({ label, error, endAdornment, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  const borderClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-500'

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/60 ${endAdornment ? 'pr-16' : ''} ${borderClasses} ${className}`}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
