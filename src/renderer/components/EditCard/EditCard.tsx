import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useNavigate } from 'react-router'
import Button from '../Button/Button'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../constants'
import './EditCard.css'

const EditCard = () => {
  const size: Size = useWindowSize()
  const navigate = useNavigate()

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
            <Button onClick={() => navigate('/')}>Finished</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCard
