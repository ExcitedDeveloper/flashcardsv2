import { createCueCard } from '../../renderer/util/cueCard'

// Mock uuid to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-123')
}))

describe('cueCard utilities', () => {
  describe('createCueCard', () => {
    it('should create a cue card with provided question and answer', () => {
      const question = 'What is 2 + 2?'
      const answer = '4'

      const result = createCueCard(question, answer)

      expect(result).toEqual({
        id: 'mocked-uuid-123',
        question,
        answer,
        history: ''
      })
    })

    it('should create a cue card with empty history', () => {
      const result = createCueCard('Question', 'Answer')

      expect(result.history).toBe('')
    })

    it('should generate unique ID for each card', () => {
      const result = createCueCard('Question', 'Answer')

      expect(result.id).toBe('mocked-uuid-123')
      expect(typeof result.id).toBe('string')
    })

    it('should handle empty strings', () => {
      const result = createCueCard('', '')

      expect(result).toEqual({
        id: 'mocked-uuid-123',
        question: '',
        answer: '',
        history: ''
      })
    })

    it('should handle whitespace in question and answer', () => {
      const question = '  What is the capital of France?  '
      const answer = '  Paris  '

      const result = createCueCard(question, answer)

      expect(result.question).toBe(question)
      expect(result.answer).toBe(answer)
    })

    it('should handle long text', () => {
      const longQuestion = 'A'.repeat(1000)
      const longAnswer = 'B'.repeat(1000)

      const result = createCueCard(longQuestion, longAnswer)

      expect(result.question).toBe(longQuestion)
      expect(result.answer).toBe(longAnswer)
    })

    it('should handle special characters', () => {
      const question = 'What is the formula for H₂O?'
      const answer = 'Water (диhydrogen monoxide)'

      const result = createCueCard(question, answer)

      expect(result.question).toBe(question)
      expect(result.answer).toBe(answer)
    })
  })
})
