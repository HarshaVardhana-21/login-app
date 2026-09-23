import { useState, type ComponentProps } from 'react'
import Input from './Input.tsx'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'endAdornment'>

function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          aria-label={isVisible ? `Hide ${props.label.toLowerCase()}` : `Show ${props.label.toLowerCase()}`}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      }
    />
  )
}

export default PasswordInput
