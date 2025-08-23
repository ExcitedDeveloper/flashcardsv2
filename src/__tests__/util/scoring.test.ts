import {
  calculateScore,
  updateHistory,
  getSuccessRate
} from '../../renderer/util/scoring'

describe('scoring utilities', () => {
  describe('calculateScore', () => {
    it('should return empty string for empty history', () => {
      expect(calculateScore('')).toBe('')
    })

    it('should return empty string for undefined history', () => {
      expect(calculateScore(undefined as string | undefined)).toBe('')
    })

    it('should calculate 100% for all correct answers', () => {
      expect(calculateScore('YYY')).toBe('100%')
    })

    it('should calculate 0% for all incorrect answers', () => {
      expect(calculateScore('NNN')).toBe('0%')
    })

    it('should calculate 50% for half correct answers', () => {
      expect(calculateScore('YNYN')).toBe('50%')
    })

    it('should calculate 66% for 2 out of 3 correct', () => {
      expect(calculateScore('YYN')).toBe('66%')
    })

    it('should calculate 33% for 1 out of 3 correct', () => {
      expect(calculateScore('NYN')).toBe('33%')
    })

    it('should round down fractional percentages', () => {
      expect(calculateScore('YN')).toBe('50%')
      expect(calculateScore('YYNN')).toBe('50%')
    })

    it('should handle single character history', () => {
      expect(calculateScore('Y')).toBe('100%')
      expect(calculateScore('N')).toBe('0%')
    })
  })

  describe('updateHistory', () => {
    it('should append Y for correct answer', () => {
      expect(updateHistory('YN', true)).toBe('YNY')
    })

    it('should append N for incorrect answer', () => {
      expect(updateHistory('YN', false)).toBe('YNN')
    })

    it('should work with empty history', () => {
      expect(updateHistory('', true)).toBe('Y')
      expect(updateHistory('', false)).toBe('N')
    })

    it('should maintain existing history', () => {
      const existingHistory = 'YYNNY'
      expect(updateHistory(existingHistory, true)).toBe(`${existingHistory}Y`)
      expect(updateHistory(existingHistory, false)).toBe(`${existingHistory}N`)
    })
  })

  describe('getSuccessRate', () => {
    it('should return 0 for empty history', () => {
      expect(getSuccessRate('')).toBe(0)
    })

    it('should return 0 for undefined history', () => {
      expect(getSuccessRate(undefined as string | undefined)).toBe(0)
    })

    it('should return 100 for all correct answers', () => {
      expect(getSuccessRate('YYYY')).toBe(100)
    })

    it('should return 0 for all incorrect answers', () => {
      expect(getSuccessRate('NNNN')).toBe(0)
    })

    it('should return correct percentage for mixed results', () => {
      expect(getSuccessRate('YNYN')).toBe(50)
      expect(getSuccessRate('YYN')).toBe(66)
      expect(getSuccessRate('NYN')).toBe(33)
    })

    it('should return number, not string', () => {
      const result = getSuccessRate('YN')
      expect(typeof result).toBe('number')
      expect(result).toBe(50)
    })
  })
})
