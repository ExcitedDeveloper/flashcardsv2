import 'react-toastify/dist/ReactToastify.css'
import { AgGridReact } from 'ag-grid-react'
import useWindowSize, { Size } from 'renderer/hooks/useWindowSize'
import { useAppSelector } from '../../redux/hooks'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
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

const DEFAULT_WINDOW_HEIGHT = 500
const MENU_BAR_HEIGHT = 20
const FOOTER_HEIGHT = 80

const handleSortChanged = () => {
  const divs = document.querySelectorAll('.ag-root .ag-center-cols-container')

  if (!divs || divs.length < 0) return

  const gridDiv = divs[0]

  if (!gridDiv) return

  gridDiv.scrollIntoView(true)
}

const CardList = () => {
  const { cueCards } = useAppSelector((state) => state.cueCards)
  const size: Size = useWindowSize()

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
          onSortChanged={handleSortChanged}
        />
      </div>
      <div className="card-list-footer">lkljkkjkj</div>
    </div>
  )
}

export default CardList
