import { act, renderHook } from '@testing-library/react'
import type { ChangeEvent, FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useForm, type FormErrors } from './useForm.ts'

interface Values {
  name: string
  agree: boolean
}

const initialValues: Values = { name: '', agree: false }

const validate = (values: Values): FormErrors<Values> => ({
  name: values.name ? undefined : 'Name is required.',
})

function changeEvent(name: string, value: string, type = 'text', checked = false) {
  return { target: { name, value, type, checked } } as ChangeEvent<HTMLInputElement>
}

function submitEvent() {
  return { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>
}

function setup(overrides: Partial<Parameters<typeof useForm<Values, string>>[0]> = {}) {
  const onSubmit = vi.fn(async () => 'ok')
  const onSuccess = vi.fn()
  const hook = renderHook(() =>
    useForm<Values, string>({ initialValues, validate, onSubmit, onSuccess, ...overrides }),
  )
  return { ...hook, onSubmit, onSuccess }
}

describe('useForm', () => {
  it('starts with the initial values and no errors', () => {
    const { result } = setup()
    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.submitError).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates text and checkbox fields', () => {
    const { result } = setup()
    act(() => result.current.handleChange(changeEvent('name', 'Jane')))
    act(() => result.current.handleChange(changeEvent('agree', 'on', 'checkbox', true)))
    expect(result.current.values).toEqual({ name: 'Jane', agree: true })
  })

  it('blocks submission and sets errors when validation fails', async () => {
    const { result, onSubmit } = setup()
    const event = submitEvent()
    await act(() => result.current.handleSubmit(event))

    expect(event.preventDefault).toHaveBeenCalled()
    expect(result.current.errors.name).toBe('Name is required.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears a field error once the field is edited', async () => {
    const { result } = setup()
    await act(() => result.current.handleSubmit(submitEvent()))
    expect(result.current.errors.name).toBeDefined()

    act(() => result.current.handleChange(changeEvent('name', 'J')))
    expect(result.current.errors.name).toBeUndefined()
  })

  it('submits valid values and calls onSuccess with the result', async () => {
    const { result, onSubmit, onSuccess } = setup()
    act(() => result.current.handleChange(changeEvent('name', 'Jane')))
    await act(() => result.current.handleSubmit(submitEvent()))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Jane', agree: false })
    expect(onSuccess).toHaveBeenCalledWith('ok')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('tracks isSubmitting while the submit is pending', async () => {
    let resolve!: (value: string) => void
    const { result } = setup({ onSubmit: () => new Promise<string>((r) => (resolve = r)) })
    act(() => result.current.handleChange(changeEvent('name', 'Jane')))

    let pending!: Promise<void>
    act(() => {
      pending = result.current.handleSubmit(submitEvent())
    })
    expect(result.current.isSubmitting).toBe(true)

    await act(async () => {
      resolve('done')
      await pending
    })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('exposes the error message when submit throws', async () => {
    const { result, onSuccess } = setup({
      onSubmit: async () => {
        throw new Error('Server exploded.')
      },
    })
    act(() => result.current.handleChange(changeEvent('name', 'Jane')))
    await act(() => result.current.handleSubmit(submitEvent()))

    expect(result.current.submitError).toBe('Server exploded.')
    expect(onSuccess).not.toHaveBeenCalled()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('falls back to a generic message for non-Error throws', async () => {
    const { result } = setup({ onSubmit: () => Promise.reject('nope') })
    act(() => result.current.handleChange(changeEvent('name', 'Jane')))
    await act(() => result.current.handleSubmit(submitEvent()))

    expect(result.current.submitError).toBe('Something went wrong.')
  })
})
