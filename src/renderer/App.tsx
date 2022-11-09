import { useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router'
import { useAppSelector } from './redux/hooks'
import CardList from './components/CardList/CardList'
import EditCard from './components/EditCard/EditCard'
import { Channels } from '../main/util'
import './App.css'

export default function App() {
  const { displayFileName, isDirty } = useAppSelector((state) => state.cueCards)

  useEffect(() => {
    document.title = displayFileName
  }, [displayFileName])

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(Channels.SetDirty, [isDirty])
  }, [isDirty])

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
