import 'react-toastify/dist/ReactToastify.css'
import { AgGridReact } from 'ag-grid-react'
import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../redux/hooks'
import { clearScrollAction } from '../../redux/cueCards'
import Button from '../Button/Button'
import {
  DEFAULT_WINDOW_HEIGHT,
  MENU_BAR_HEIGHT,
  FOOTER_HEIGHT
} from '../../constants'
import { ScrollAction } from '../../types/scroll'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import '../../App.css'
import './CardList.css'

const columnDefs = [
  {
    field: 'question',
    sortable: true,
    filter: true,
    flex: 2
  },
  {
    field: 'answer',
    sortable: true,
    filter: true,
    flex: 2
  },
  {
    field: 'score',
    sortable: true,
    filter: true,
    flex: 1,
    comparator: (valueA: string, valueB: string) => {
      // valueA and valueB are in format <num>% or for ex 100%
      // Strip off the '%' to get the num
      const numA = Number(valueA.slice(0, -1))
      const numB = Number(valueB.slice(0, -1))

      if (numA === numB) {
        return 0
      }
      if (numA > numB) {
        return 1
      }
      return -1
    }
  }
]

const changeScroll = (scroll: ScrollAction = ScrollAction.Top) => {
  setTimeout(() => {
    const divs = document.querySelectorAll('.ag-root .ag-center-cols-container')

    if (!divs || divs.length < 0) return

    const gridDiv = divs[0]

    if (!gridDiv) return

    gridDiv.scrollIntoView(scroll === ScrollAction.Top)
  }, 500)
}

const CardList = () => {
  const { cueCards, shouldScroll } = useAppSelector((state) => state.cueCards)
  const size: Size = useWindowSize()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleScroll = () => {
    if (shouldScroll) {
      changeScroll(shouldScroll)
      dispatch(clearScrollAction())
    }
  }

  return (
    <div
      className="card-list"
      style={{
        height: (size.height || DEFAULT_WINDOW_HEIGHT) - MENU_BAR_HEIGHT
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{
          height:
            (size.height || DEFAULT_WINDOW_HEIGHT) -
            MENU_BAR_HEIGHT -
            FOOTER_HEIGHT
        }}
      >
        <AgGridReact
          rowData={cueCards}
          columnDefs={columnDefs}
          onSortChanged={() => changeScroll(ScrollAction.Top)}
          // onModelUpdated={handleScroll}
          onGridReady={handleScroll}
        />
      </div>
      <div className="card-list-footer">
        <div className="card-list-buttons">
          <div className="card-list-modify-buttons">
            <Button
              onClick={() => navigate('/AddCard')}
              className="margin-right-sm"
            >
              New Card
            </Button>
            <Button
              onClick={() => navigate('/EditCard')}
              className="margin-right-sm"
            >
              Edit Card
            </Button>
            <Button onClick={() => {}}>Delete Card</Button>
          </div>
          <div className="card-list-study-button">
            <Button onClick={() => {}}>Study</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardList
