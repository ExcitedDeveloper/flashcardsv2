import { useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router'
import CardList from './components/CardList/CardList'
import EditCard from './components/EditCard/EditCard'
import { Channels } from '../main/util'
import './App.css'

export default function App() {
  const minimize = () => {
    window.electron.ipcRenderer.sendMessage(Channels.MinimizeApp, [])
  }

  const closeApp = () => {
    window.electron.ipcRenderer.sendMessage(Channels.CloseApp, [])
  }

  useEffect(() => {
    const minimizeEl = document.getElementById('minimize')
    const closeAppEl = document.getElementById('close-app')

    minimizeEl?.addEventListener('click', minimize)
    closeAppEl?.addEventListener('click', closeApp)

    return () => {
      minimizeEl?.removeEventListener('click', minimize)
      closeAppEl?.removeEventListener('click', closeApp)
    }
  }, [])

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
