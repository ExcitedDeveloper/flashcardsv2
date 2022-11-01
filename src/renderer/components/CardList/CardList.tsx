import 'react-toastify/dist/ReactToastify.css'
import { AgGridReact } from 'ag-grid-react'
import { useAppSelector } from '../../redux/hooks'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import './CardList.css'

const columnDefs = [
  {
    field: 'question',
    sortable: true,
    filter: true
  },
  {
    field: 'answer',
    sortable: true,
    filter: true
  },
  {
    field: 'score',
    sortable: true,
    filter: true
  }
]

const CardList = () => {
  const { cueCards } = useAppSelector((state) => state.cueCards)

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact rowData={cueCards} columnDefs={columnDefs} />
    </div>
  )
}

export default CardList
