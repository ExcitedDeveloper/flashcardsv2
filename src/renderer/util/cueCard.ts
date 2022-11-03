import CueCard from 'renderer/types/cueCard'
import { v4 as uuidv4 } from 'uuid'

export const createCueCard = (question: string, answer: string): CueCard => ({
  id: uuidv4(),
  question,
  answer,
  history: ''
})
