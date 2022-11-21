export default interface CueCard {
  id: string
  question: string
  answer: string
  history: string
}

export interface OpenFileInfo {
  cueCards: CueCard[]
  filePath: string
}
