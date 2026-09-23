import { useTheme } from '../../hooks/useTheme.ts'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    >
      {isDark ? (
        <svg className="size-4.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3v1.5M12 19.5V21M21 12h-1.5M4.5 12H3M18.36 5.64l-1.06 1.06M6.7 17.3l-1.06 1.06M18.36 18.36l-1.06-1.06M6.7 6.7 5.64 5.64"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      ) : (
        <svg className="size-4.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20.5 14.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
