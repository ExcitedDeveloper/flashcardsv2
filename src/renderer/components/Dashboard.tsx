import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppSelector } from '../redux/hooks'

const Dashboard = () => {
  const { cueCards } = useAppSelector((state) => state.cueCards)

  return (
    <>
      <h2>Number of Cue Cards: {(cueCards ?? []).length}</h2>
      <ToastContainer />
    </>
  )
}

export default Dashboard
