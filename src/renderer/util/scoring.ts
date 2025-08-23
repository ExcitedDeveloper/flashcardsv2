export const calculateScore = (history: string | undefined): string => {
  if (!history || history.length === 0) {
    return ''
  }

  const tries = history.length
  const successes = history.split('').reduce((acc: number, curr: string) => {
    return curr === 'Y' ? acc + 1 : acc
  }, 0)

  let score = Math.floor((successes / tries) * 100)
  score = Math.max(0, Math.min(100, score)) // Clamp between 0 and 100

  return `${score}%`
}

export const updateHistory = (
  currentHistory: string,
  isCorrect: boolean
): string => {
  return currentHistory + (isCorrect ? 'Y' : 'N')
}

export const getSuccessRate = (history: string | undefined): number => {
  if (!history || history.length === 0) {
    return 0
  }

  const tries = history.length
  const successes = history.split('').reduce((acc: number, curr: string) => {
    return curr === 'Y' ? acc + 1 : acc
  }, 0)

  return Math.floor((successes / tries) * 100)
}
