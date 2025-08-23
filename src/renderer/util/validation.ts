export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validateCueCardInput = (
  question: string | null | undefined,
  answer: string | null | undefined
): ValidationResult => {
  if (
    !question ||
    typeof question !== 'string' ||
    question.trim().length === 0
  ) {
    return {
      isValid: false,
      message: 'Please enter text for the question.'
    }
  }

  if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
    return {
      isValid: false,
      message: 'Please enter text for the answer.'
    }
  }

  return { isValid: true }
}

export const validateNonEmptyString = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      message: `${fieldName} cannot be empty.`
    }
  }
  return { isValid: true }
}
