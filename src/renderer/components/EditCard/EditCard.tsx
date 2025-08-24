import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useAppSelector } from 'redux/hooks'
import useWindowSize, { Size } from '../../hooks/useWindowSize'
import { useFormInput } from '../../hooks/useFormInput'
import { useCueCardOperations } from '../../hooks/useCueCardOperations'
import CueCard from '../../types/cueCard'
import {
  calculateContentHeight,
  calculateMainContentHeight
} from '../../util/layout'
import Button from '../Button/Button'
import './EditCard.css'

enum ButtonClickType {
  AddAnother,
  Finished
}

const getCueCard = (cards: CueCard[], id: string) => {
  return cards.find((card) => card.id === id)
}

const EditCard = () => {
  const size: Size = useWindowSize()
  const location = useLocation()
  const { cueCards: currCueCards } = useAppSelector((state) => state.cueCards)
  const { createCard, updateCard, navigateToAddCard, navigateToHome } =
    useCueCardOperations()

  const questionInput = useFormInput('')
  const answerInput = useFormInput('')

  // Extract stable methods for useEffect dependencies
  const { setValue: setQuestion, reset: resetQuestion } = questionInput
  const { setValue: setAnswer, reset: resetAnswer } = answerInput

  // ESLint wants questionInput/answerInput in deps, but including them causes infinite re-renders
  // The extracted stable methods are the correct dependencies to avoid this issue
  useEffect(() => {
    if (location.state?.selectedRowId) {
      const currCard = getCueCard(currCueCards, location.state.selectedRowId)
      if (currCard) {
        setQuestion(currCard.question)
        setAnswer(currCard.answer)
      }
    } else {
      resetQuestion()
      resetAnswer()
    }
  }, [
    location.state?.selectedRowId,
    currCueCards,
    setQuestion,
    setAnswer,
    resetQuestion,
    resetAnswer
  ])

  const handleButtonClick = (clickType: ButtonClickType) => {
    const question = questionInput.value.trim()
    const answer = answerInput.value.trim()

    let success = false

    if (location.state?.selectedRowId) {
      success = updateCard(location.state.selectedRowId, question, answer)
    } else {
      success = createCard(question, answer)
    }

    if (success) {
      if (clickType === ButtonClickType.AddAnother) {
        navigateToAddCard()
      } else {
        navigateToHome()
      }
    }
  }

  const handleAddAnother = () => {
    handleButtonClick(ButtonClickType.AddAnother)
  }

  const handleFinished = () => {
    handleButtonClick(ButtonClickType.Finished)
  }

  return (
    <div
      className="edit-card"
      style={{
        height: calculateContentHeight(size.height)
      }}
    >
      <div
        className="edit-card-content"
        style={{
          height: calculateMainContentHeight(size.height)
        }}
      >
        <div className="edit-card-question">
          <fieldset className="edit-card-fieldset">
            <legend>Question</legend>
            <textarea
              name="question"
              id="question"
              cols={30}
              rows={10}
              className="edit-card-textarea"
              value={questionInput.value}
              onChange={questionInput.onChange}
            />
          </fieldset>
        </div>
        <div className="edit-card-answer">
          <fieldset className="edit-card-fieldset">
            <legend>Answer</legend>
            <textarea
              name="answer"
              id="answer"
              cols={30}
              rows={10}
              className="edit-card-textarea"
              value={answerInput.value}
              onChange={answerInput.onChange}
            />
          </fieldset>
        </div>
      </div>
      <div className="edit-card-footer">
        <div className="edit-card-buttons">
          <div className="edit-card-study-button">
            <Button
              onClick={handleAddAnother}
              style={{ width: '9rem' }}
              className="margin-right-sm"
            >
              Add Another Card
            </Button>
            <Button onClick={handleFinished}>Finished</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCard
