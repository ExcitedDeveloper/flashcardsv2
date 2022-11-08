import { useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router'
import { useAppSelector } from './redux/hooks'
import CardList from './components/CardList/CardList'
import EditCard from './components/EditCard/EditCard'
import './App.css'

export default function App() {
  const { displayFileName } = useAppSelector((state) => state.cueCards)

  useEffect(() => {
    document.title = displayFileName
  }, [displayFileName])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardList />} />
        <Route path="/AddCard" element={<EditCard />} />
        <Route path="/EditCard" element={<EditCard />} />
      </Routes>
    </Router>
  )
}
