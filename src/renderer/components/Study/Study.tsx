import { useEffect, useState } from 'react'
import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import {
  StudyStatus,
  setStudyMode,
  answerQuestion
} from '../../../redux/cueCards'
import Button from '../Button/Button'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../constants'
import './Study.css'
import { useAppSelector } from '../../../redux/hooks'

const Study = () => {
  const size: Size = useWindowSize()
  const { studyMode, studyCueCardIndex, cueCards } = useAppSelector(
    (state) => state.cueCards
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currQuestion, setCurrQuestion] = useState<string | undefined>()
  const [currAnswer, setCurrAnswer] = useState<string | undefined>()

  useEffect(() => {
    if (studyCueCardIndex !== undefined) {
      const currCueCard = cueCards[studyCueCardIndex]

      if (currCueCard) {
        setCurrQuestion(currCueCard.question)
        setCurrAnswer(currCueCard.answer)
        return
      }
    }

    setCurrQuestion(undefined)
    setCurrAnswer(undefined)
  }, [studyCueCardIndex, cueCards])

  return (
    <div
      className="study-card"
      style={{
        height: (size.height || DEFAULT_WINDOW_HEIGHT) - MENU_BAR_HEIGHT
      }}
    >
      <div
        className="study-card-content"
        style={{
          height:
            (size.height || DEFAULT_WINDOW_HEIGHT) -
            MENU_BAR_HEIGHT -
            FOOTER_HEIGHT
        }}
      >
        <div className="study-card-question">{currQuestion}</div>
        <div className="study-card-answer">
          {studyMode === StudyStatus.Answer ? currAnswer : undefined}
        </div>
      </div>
      <div className="study-card-footer">
        <div className="study-card-buttons">
          {studyMode === StudyStatus.Question && (
            <div className="study-ask-question">
              <Button
                onClick={() => {
                  dispatch(setStudyMode(StudyStatus.Answer))
                }}
              >
                Show Answer
              </Button>
              <Button
                onClick={() => {
                  dispatch(setStudyMode(undefined))
                  navigate('/')
                }}
              >
                Stop Studying
              </Button>
            </div>
          )}
          {studyMode === StudyStatus.Answer && (
            <div className="study-answer-question">
              <div>
                {studyCueCardIndex !== undefined && (
                  <>
                    <Button
                      onClick={() => {
                        dispatch(answerQuestion(true))
                      }}
                      className="margin-right-sm"
                    >
                      Correct
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch(answerQuestion(false))
                      }}
                    >
                      Incorrect
                    </Button>
                  </>
                )}
              </div>
              <Button
                onClick={() => {
                  dispatch(setStudyMode(undefined))
                  navigate('/')
                }}
              >
                Stop Studying
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Study
