import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { AgGridReact } from 'ag-grid-react'
import {
  RowSelectedEvent,
  ModelUpdatedEvent,
  RowNode,
  GridApi
} from 'ag-grid-community'
import useWindowSize, { Size } from '../../hooks/useWindowSize'
import CueCard from '../../types/cueCard'
import { useAppSelector } from '../../../redux/hooks'
import { calculateScore } from '../../util/scoring'
import {
  calculateContentHeight,
  calculateMainContentHeight
} from '../../util/layout'
import {
  clearScrollAction,
  deleteCueCard,
  startStudying,
  loadCueCards
} from '../../../redux/cueCards'
import Button from '../Button/Button'
import { ScrollAction } from '../../types/scroll'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import '../../App.css'
import './CardList.css'

const scoreComparator = (valueA: string, valueB: string) => {
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
    comparator: scoreComparator
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
  const [selectedRowId, setSelectedRowId] = useState()
  const [gridApi, setGridApi] = useState<GridApi>()

  const cueCardsWithScores = useMemo(() => {
    return cueCards.map((card) => ({
      ...card,
      score: calculateScore(card.history)
    }))
  }, [cueCards])

  const handleScroll = useCallback(() => {
    if (shouldScroll) {
      changeScroll(shouldScroll)
      dispatch(clearScrollAction())
    }
  }, [shouldScroll, dispatch])

  const handleRowSelected = useCallback((e: RowSelectedEvent) => {
    setSelectedRowId(e.data.id)
  }, [])

  const handleDeleteCard = useCallback(() => {
    dispatch(deleteCueCard(selectedRowId || ''))
    setSelectedRowId(undefined)
  }, [dispatch, selectedRowId])

  const handleStudy = useCallback(() => {
    dispatch(startStudying())
    navigate('/Study')
  }, [dispatch, navigate])

  const handleSortChanged = useCallback(() => {
    changeScroll(ScrollAction.Top)

    if (gridApi) {
      const rowData: CueCard[] = []

      gridApi.forEachNodeAfterFilterAndSort((node: RowNode) =>
        rowData.push(node.data)
      )

      dispatch(loadCueCards(rowData))
    }
  }, [gridApi, dispatch])

  return (
    <div
      className="card-list"
      style={{
        height: calculateContentHeight(size.height)
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{
          height: calculateMainContentHeight(size.height)
        }}
      >
        <AgGridReact
          rowData={cueCardsWithScores}
          columnDefs={columnDefs}
          onSortChanged={handleSortChanged}
          onGridReady={handleScroll}
          rowSelection="single"
          onRowSelected={handleRowSelected}
          onModelUpdated={(e: ModelUpdatedEvent) => {
            const { api } = e

            setGridApi(api)

            // const rowData: CueCard[] = []

            // gridApi.forEachNodeAfterFilterAndSort((node: RowNode) =>
            //   rowData.push(node.data)
            // )

            // dispatch(loadCueCards(rowData))
          }}
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
              onClick={() =>
                navigate('/EditCard', { state: { selectedRowId } })
              }
              className="margin-right-sm"
              disabled={!selectedRowId}
            >
              Edit Card
            </Button>
            <Button onClick={handleDeleteCard} disabled={!selectedRowId}>
              Delete Card
            </Button>
          </div>
          <div className="card-list-study-button">
            <Button onClick={handleStudy} disabled={cueCards.length <= 0}>
              Study
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardList
