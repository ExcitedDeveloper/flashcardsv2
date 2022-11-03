import { useRef } from 'react'
import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { createCueCard } from 'renderer/util/cueCard'
import { toastOptions } from 'renderer/util/util'
import Button from '../Button/Button'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../constants'
import { Channels } from '../../../main/util'
import './EditCard.css'

const EditCard = () => {
  const size: Size = useWindowSize()
  const navigate = useNavigate()
  const questionRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<HTMLTextAreaElement>(null)

  const handleFinished = () => {
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

    // Create a CueCard
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newCueCard = createCueCard(question!, answer!)

    window.electron.ipcRenderer.sendMessage(Channels.AddCueCard, [newCueCard])

    navigate('/')
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
              onClick={() => navigate('/AddCard')}
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
