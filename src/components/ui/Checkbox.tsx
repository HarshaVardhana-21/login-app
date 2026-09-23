import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

function Checkbox({ label, error, id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const errorId = `${checkboxId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
      >
        <input
          id={checkboxId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="size-4 rounded border-slate-300 accent-indigo-600 dark:border-slate-600 dark:bg-slate-800"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkbox
