import {
  validateCueCardInput,
  validateNonEmptyString
} from '../../renderer/util/validation'

describe('validation utilities', () => {
  describe('validateCueCardInput', () => {
    it('should validate valid question and answer', () => {
      const result = validateCueCardInput('Valid question?', 'Valid answer.')
      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should reject empty question', () => {
      const result = validateCueCardInput('', 'Valid answer.')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the question.')
    })

    it('should reject whitespace-only question', () => {
      const result = validateCueCardInput('   ', 'Valid answer.')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the question.')
    })

    it('should reject empty answer', () => {
      const result = validateCueCardInput('Valid question?', '')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the answer.')
    })

    it('should reject whitespace-only answer', () => {
      const result = validateCueCardInput('Valid question?', '   ')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the answer.')
    })

    it('should reject both empty question and answer', () => {
      const result = validateCueCardInput('', '')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the question.')
    })

    it('should handle undefined inputs', () => {
      const result = validateCueCardInput(
        undefined as string | undefined,
        undefined as string | undefined
      )
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the question.')
    })

    it('should handle null inputs', () => {
      const result = validateCueCardInput(
        null as string | null,
        null as string | null
      )
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Please enter text for the question.')
    })

    it('should trim whitespace before validation', () => {
      const result = validateCueCardInput(
        '  Valid question?  ',
        '  Valid answer.  '
      )
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateNonEmptyString', () => {
    it('should validate non-empty string', () => {
      const result = validateNonEmptyString('Valid text', 'Field')
      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should reject empty string', () => {
      const result = validateNonEmptyString('', 'Field')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Field cannot be empty.')
    })

    it('should reject whitespace-only string', () => {
      const result = validateNonEmptyString('   ', 'Field')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Field cannot be empty.')
    })

    it('should use custom field name in error message', () => {
      const result = validateNonEmptyString('', 'Question')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Question cannot be empty.')
    })

    it('should handle different field names', () => {
      const result = validateNonEmptyString('', 'Answer')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Answer cannot be empty.')
    })

    it('should trim whitespace before validation', () => {
      const result = validateNonEmptyString('  Valid text  ', 'Field')
      expect(result.isValid).toBe(true)
    })
  })
})
