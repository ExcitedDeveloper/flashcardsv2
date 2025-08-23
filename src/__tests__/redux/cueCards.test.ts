import { configureStore } from '@reduxjs/toolkit'
import cueCardsReducer, {
  CueCardsState,
  StudyStatus,
  setDirty,
  loadCueCards,
  newFile,
  openFile,
  addCueCard,
  editCueCard,
  deleteCueCard,
  clearScrollAction,
  saveFile,
  resetScores,
  setStudyMode,
  startStudying,
  answerQuestion
} from '../../redux/cueCards'
import { ScrollAction } from '../../renderer/types/scroll'
import { createMockCueCard } from '../utils/testUtils'

type RootState = {
  cueCards: CueCardsState
}

describe('cueCards Redux slice', () => {
  let store: ReturnType<typeof configureStore<RootState>>
  let initialState: CueCardsState

  beforeEach(() => {
    initialState = {
      cueCards: [],
      shouldScroll: undefined,
      filePath: undefined,
      isDirty: false,
      studyMode: undefined,
      studyCueCardIndex: undefined
    }

    store = configureStore<RootState>({
      reducer: {
        cueCards: cueCardsReducer
      },
      preloadedState: {
        cueCards: initialState
      }
    })
  })

  describe('setDirty action', () => {
    it('should set isDirty to true', () => {
      store.dispatch(setDirty(true))
      const state = store.getState().cueCards
      expect(state.isDirty).toBe(true)
    })

    it('should set isDirty to false', () => {
      store.dispatch(setDirty(false))
      const state = store.getState().cueCards
      expect(state.isDirty).toBe(false)
    })
  })

  describe('loadCueCards action', () => {
    it('should load cue cards and set dirty state', () => {
      const mockCards = [
        createMockCueCard(),
        createMockCueCard({ id: 'test-2' })
      ]

      store.dispatch(loadCueCards(mockCards))
      const state = store.getState().cueCards

      expect(state.cueCards).toEqual(mockCards)
      expect(state.isDirty).toBe(true)
      expect(state.studyMode).toBeUndefined()
      expect(state.filePath).toBeUndefined()
    })
  })

  describe('newFile action', () => {
    it('should reset state for new file', () => {
      // Set some initial state
      store.dispatch(setDirty(true))
      store.dispatch(addCueCard(createMockCueCard()))

      store.dispatch(newFile())
      const state = store.getState().cueCards

      expect(state.cueCards).toEqual([])
      expect(state.filePath).toBeUndefined()
      expect(state.isDirty).toBe(false)
      expect(state.studyMode).toBeUndefined()
    })
  })

  describe('openFile action', () => {
    it('should open file with cue cards', () => {
      const mockCards = [createMockCueCard()]
      const filePath = '/path/to/file.json'

      store.dispatch(openFile({ cueCards: mockCards, filePath }))
      const state = store.getState().cueCards

      expect(state.cueCards).toEqual(mockCards)
      expect(state.filePath).toBe(filePath)
      expect(state.isDirty).toBe(false)
      expect(state.studyMode).toBeUndefined()
    })
  })

  describe('addCueCard action', () => {
    it('should add a new cue card', () => {
      const mockCard = createMockCueCard()

      store.dispatch(addCueCard(mockCard))
      const state = store.getState().cueCards

      expect(state.cueCards).toContainEqual(mockCard)
      expect(state.shouldScroll).toBe(ScrollAction.Bottom)
      expect(state.isDirty).toBe(true)
    })
  })

  describe('editCueCard action', () => {
    it('should edit existing cue card', () => {
      const originalCard = createMockCueCard()
      const updatedCard = { ...originalCard, question: 'Updated question' }

      store.dispatch(addCueCard(originalCard))
      store.dispatch(editCueCard(updatedCard))

      const state = store.getState().cueCards
      expect(state.cueCards[0]).toEqual(updatedCard)
      expect(state.isDirty).toBe(true)
    })

    it('should not modify other cards when editing', () => {
      const card1 = createMockCueCard({ id: 'card-1' })
      const card2 = createMockCueCard({ id: 'card-2' })
      const updatedCard1 = { ...card1, question: 'Updated question' }

      store.dispatch(addCueCard(card1))
      store.dispatch(addCueCard(card2))
      store.dispatch(editCueCard(updatedCard1))

      const state = store.getState().cueCards
      expect(state.cueCards[0]).toEqual(updatedCard1)
      expect(state.cueCards[1]).toEqual(card2)
    })
  })

  describe('deleteCueCard action', () => {
    it('should delete cue card by id', () => {
      const card1 = createMockCueCard({ id: 'card-1' })
      const card2 = createMockCueCard({ id: 'card-2' })

      store.dispatch(addCueCard(card1))
      store.dispatch(addCueCard(card2))
      store.dispatch(deleteCueCard('card-1'))

      const state = store.getState().cueCards
      expect(state.cueCards).toHaveLength(1)
      expect(state.cueCards[0]).toEqual(card2)
      expect(state.isDirty).toBe(true)
    })
  })

  describe('clearScrollAction action', () => {
    it('should clear scroll action', () => {
      store.dispatch(addCueCard(createMockCueCard())) // Sets shouldScroll
      store.dispatch(clearScrollAction())

      const state = store.getState().cueCards
      expect(state.shouldScroll).toBeUndefined()
    })
  })

  describe('saveFile action', () => {
    it('should save file path and clear dirty state', () => {
      const filePath = '/path/to/saved/file.json'

      store.dispatch(setDirty(true))
      store.dispatch(saveFile(filePath))

      const state = store.getState().cueCards
      expect(state.filePath).toBe(filePath)
      expect(state.isDirty).toBe(false)
    })
  })

  describe('resetScores action', () => {
    it('should reset history and score for all cards', () => {
      const cardWithHistory = createMockCueCard({ history: 'YYN' })

      store.dispatch(addCueCard(cardWithHistory))
      store.dispatch(resetScores())

      const state = store.getState().cueCards
      expect(state.cueCards[0].history).toBe('')
      expect(state.isDirty).toBe(true)
    })
  })

  describe('setStudyMode action', () => {
    it('should set study mode', () => {
      store.dispatch(setStudyMode(StudyStatus.Question))

      const state = store.getState().cueCards
      expect(state.studyMode).toBe(StudyStatus.Question)
    })

    it('should clear study mode', () => {
      store.dispatch(setStudyMode(undefined))

      const state = store.getState().cueCards
      expect(state.studyMode).toBeUndefined()
    })
  })

  describe('startStudying action', () => {
    it('should start studying with first card', () => {
      store.dispatch(addCueCard(createMockCueCard()))
      store.dispatch(startStudying())

      const state = store.getState().cueCards
      expect(state.studyMode).toBe(StudyStatus.Question)
      expect(state.studyCueCardIndex).toBe(0)
    })
  })

  describe('answerQuestion action', () => {
    it('should record correct answer and advance to next card', () => {
      const cards = [
        createMockCueCard({ id: 'card-1' }),
        createMockCueCard({ id: 'card-2' })
      ]

      cards.forEach((card) => store.dispatch(addCueCard(card)))
      store.dispatch(startStudying())
      store.dispatch(answerQuestion(true))

      const state = store.getState().cueCards
      expect(state.cueCards[0].history).toBe('Y')
      expect(state.studyCueCardIndex).toBe(1)
      expect(state.isDirty).toBe(true)
    })

    it('should record incorrect answer', () => {
      const card = createMockCueCard()

      store.dispatch(addCueCard(card))
      store.dispatch(startStudying())
      store.dispatch(answerQuestion(false))

      const state = store.getState().cueCards
      expect(state.cueCards[0].history).toBe('N')
    })

    it('should end study when reaching last card', () => {
      const card = createMockCueCard()

      store.dispatch(addCueCard(card))
      store.dispatch(startStudying())
      store.dispatch(answerQuestion(true))

      const state = store.getState().cueCards
      expect(state.studyCueCardIndex).toBeUndefined()
    })
  })
})
