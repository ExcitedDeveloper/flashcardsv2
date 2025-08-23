import { useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router'
import { useAppSelector } from '../redux/hooks'
import CardList from './components/CardList/CardList'
import EditCard from './components/EditCard/EditCard'
import Study from './components/Study/Study'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { Channels } from '../main/util'
import { getFileName } from './util/util'
import './App.css'

const APP_NAME = 'Flashcards'
const DFLT_FILENAME = 'Untitled'

const getDisplayFileName = (isDirty: boolean, filePath?: string): string => {
  const fileName = getFileName(filePath)
  return `${fileName || DFLT_FILENAME}${isDirty ? '*' : ''} - ${APP_NAME}`
}

export default function App() {
  const { isDirty, filePath, cueCards } = useAppSelector(
    (state) => state.cueCards
  )

  useEffect(() => {
    document.title = getDisplayFileName(isDirty, filePath)
  }, [filePath, isDirty])

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(Channels.SetDirty, [isDirty])
  }, [isDirty])

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(Channels.SetFilePath, [filePath])
  }, [filePath])

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(Channels.UpdateState, [
      {
        filePath,
        isDirty,
        cueCards
      }
    ])
  }, [filePath, isDirty, cueCards])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<CardList />} />
          <Route path="/AddCard" element={<EditCard />} />
          <Route path="/EditCard" element={<EditCard />} />
          <Route path="/Study" element={<Study />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}
