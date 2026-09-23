import { useState, type ChangeEvent, type FormEvent } from 'react'

export type FormErrors<TValues> = Partial<Record<keyof TValues, string>>

interface UseFormOptions<TValues, TResult> {
  initialValues: TValues
  validate: (values: TValues) => FormErrors<TValues>
  onSubmit: (values: TValues) => Promise<TResult>
  onSuccess?: (result: TResult) => void
}

/**
 * Generic form state handler: tracks values, runs validation on submit,
 * and exposes loading / submit-error state for an async submit action.
 */
export function useForm<TValues extends object, TResult>({
  initialValues,
  validate,
  onSubmit,
  onSuccess,
}: UseFormOptions<TValues, TResult>) {
  const [values, setValues] = useState<TValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors<TValues>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    const fieldName = name as keyof TValues

    setValues((prev) => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value,
    }))

    // Clear the field's error as soon as the user edits it.
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.values(validationErrors).some(Boolean)) return

    setIsSubmitting(true)
    try {
      const result = await onSubmit(values)
      onSuccess?.(result)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, submitError, isSubmitting, handleChange, handleSubmit }
}
