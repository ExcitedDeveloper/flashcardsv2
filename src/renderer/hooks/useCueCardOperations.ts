import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import { useAppSelector } from 'redux/hooks'
import {
  addCueCard,
  editCueCard,
  deleteCueCard,
  startStudying
} from 'redux/cueCards'
import { createCueCard } from 'renderer/util/cueCard'
import { validateCueCardInput } from 'renderer/util/validation'
import {
  handleError,
  createError,
  ErrorType
} from 'renderer/util/errorHandling'
import CueCard from 'renderer/types/cueCard'

export const useCueCardOperations = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cueCards } = useAppSelector((state) => state.cueCards)

  const createCard = useCallback(
    (question: string, answer: string): boolean => {
      const validation = validateCueCardInput(question, answer)
      if (!validation.isValid) {
        handleError(
          createError(
            ErrorType.VALIDATION,
            validation.message || 'Validation failed'
          )
        )
        return false
      }

      const newCard = createCueCard(question, answer)
      dispatch(addCueCard(newCard))
      return true
    },
    [dispatch]
  )

  const updateCard = useCallback(
    (cardId: string, question: string, answer: string): boolean => {
      const validation = validateCueCardInput(question, answer)
      if (!validation.isValid) {
        handleError(
          createError(
            ErrorType.VALIDATION,
            validation.message || 'Validation failed'
          )
        )
        return false
      }

      const existingCard = cueCards.find((card) => card.id === cardId)
      if (!existingCard) {
        handleError(
          createError(ErrorType.UNKNOWN, 'Could not find card to edit.')
        )
        return false
      }

      const updatedCard: CueCard = {
        ...existingCard,
        question,
        answer
      }

      dispatch(editCueCard(updatedCard))
      return true
    },
    [dispatch, cueCards]
  )

  const deleteCard = useCallback(
    (cardId: string) => {
      dispatch(deleteCueCard(cardId))
    },
    [dispatch]
  )

  const startStudy = useCallback(() => {
    if (cueCards.length === 0) {
      handleError(
        createError(ErrorType.VALIDATION, 'No cards available to study.')
      )
      return
    }

    dispatch(startStudying())
    navigate('/Study')
  }, [dispatch, navigate, cueCards.length])

  const navigateToAddCard = useCallback(() => {
    navigate('/AddCard')
  }, [navigate])

  const navigateToEditCard = useCallback(
    (cardId: string) => {
      navigate('/EditCard', { state: { selectedRowId: cardId } })
    },
    [navigate]
  )

  const navigateToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  return {
    createCard,
    updateCard,
    deleteCard,
    startStudy,
    navigateToAddCard,
    navigateToEditCard,
    navigateToHome
  }
}
