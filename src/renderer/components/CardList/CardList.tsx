import 'react-toastify/dist/ReactToastify.css'
import DataGrid from 'react-data-grid'
import { useAppSelector } from '../../redux/hooks'
import 'react-data-grid/lib/styles.css'
import './CardList.css'

const columns = [
  {
    key: 'question',
    name: 'Question',
    resizable: true
  },
  {
    key: 'answer',
    name: 'Answer',
    resizable: true
  },
  {
    key: 'score',
    name: 'Score',
    resizable: true
  }
]

const CardList = () => {
  const { cueCards } = useAppSelector((state) => state.cueCards)

  return (
    <div className="card-list">
      <DataGrid
        columns={columns}
        rows={cueCards}
        style={{ minHeight: '25rem', height: '100%' }}
      />
    </div>
  )
}

export default CardList
