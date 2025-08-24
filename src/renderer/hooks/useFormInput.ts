import { useState, useCallback, ChangeEvent } from 'react'

interface UseFormInputReturn {
  value: string
  setValue: (value: string) => void
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  reset: () => void
  isEmpty: boolean
}

export const useFormInput = (initialValue = ''): UseFormInputReturn => {
  const [value, setValue] = useState(initialValue)

  const stableSetValue = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(event.target.value)
    },
    []
  )

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  const isEmpty = value.trim().length === 0

  return {
    value,
    setValue: stableSetValue,
    onChange,
    reset,
    isEmpty
  }
}
