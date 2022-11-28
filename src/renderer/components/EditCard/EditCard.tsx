import { useRef, useEffect } from 'react'
import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useNavigate, useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { createCueCard } from 'renderer/util/cueCard'
import { toastOptions } from 'renderer/util/util'
import { useDispatch } from 'react-redux'
import CueCard from 'renderer/types/cueCard'
import Button from '../Button/Button'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../constants'
import { addCueCard, editCueCard } from '../../../redux/cueCards'
import { useAppSelector } from '../../../redux/hooks'
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
  const navigate = useNavigate()
  const questionRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()
  const location = useLocation()
  const { cueCards: currCueCards } = useAppSelector((state) => state.cueCards)

  useEffect(() => {
    if (location.state?.selectedRowId) {
      const currCard = getCueCard(currCueCards, location.state.selectedRowId)

      if (questionRef.current) {
        questionRef.current.value = currCard ? currCard.question : ''
      }

      if (answerRef.current) {
        answerRef.current.value = currCard ? currCard.answer : ''
      }
    } else {
      if (questionRef.current) {
        questionRef.current.value = ''
      }

      if (answerRef.current) {
        answerRef.current.value = ''
      }
    }
  })

  const updateCueCard = (
    selectedRowId: string,
    question: string,
    answer: string
  ): CueCard | undefined => {
    const oldCueCard = currCueCards.find((card) => card.id === selectedRowId)

    if (!oldCueCard) {
      return undefined
    }

    return {
      ...oldCueCard,
      question,
      answer
    }
  }

  const handleButtonClick = (clickType: ButtonClickType) => {
    // Get the question and answer text
    const question = questionRef.current ? questionRef.current.value : undefined
    const answer = answerRef.current ? answerRef.current.value : undefined

    // Validate
    if (!question || question.length <= 0) {
      toast('Please enter text for the question.', toastOptions)
      navigate('/')
      return
    }

    if (!answer || answer.length <= 0) {
      toast('Please enter text for the answer.', toastOptions)
      navigate('/')
      return
    }

    if (location.state?.selectedRowId) {
      const updatedCueCard = updateCueCard(
        location.state.selectedRowId,
        question,
        answer
      )

      if (!updatedCueCard) {
        // eslint-disable-next-line no-console
        console.error('Could not find card to edit.')
        toast('Could not find card to edit.', toastOptions)
        return
      }

      // Editing an existing card
      dispatch(editCueCard(updatedCueCard))
    } else {
      // Create a CueCard
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newCueCard = createCueCard(question!, answer!)

      // Adding a new card
      dispatch(addCueCard(newCueCard))
    }

    if (clickType === ButtonClickType.AddAnother) {
      navigate('/AddCard')
    } else {
      navigate('/')
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
        height: (size.height || DEFAULT_WINDOW_HEIGHT) - MENU_BAR_HEIGHT
      }}
    >
      <div
        className="edit-card-content"
        style={{
          height:
            (size.height || DEFAULT_WINDOW_HEIGHT) -
            MENU_BAR_HEIGHT -
            FOOTER_HEIGHT
        }}
      >
        <div className="edit-card-question">
          <fieldset className="edit-card-fieldset">
            <legend>Question</legend>
            <textarea
              ref={questionRef}
              name="question"
              id="question"
              cols={30}
              rows={10}
              className="edit-card-textarea"
            />
          </fieldset>
        </div>
        <div className="edit-card-answer">
          <fieldset className="edit-card-fieldset">
            <legend>Answer</legend>
            <textarea
              ref={answerRef}
              name="answer"
              id="answer"
              cols={30}
              rows={10}
              className="edit-card-textarea"
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
