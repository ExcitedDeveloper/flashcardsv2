import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import './App.css'
import ImportModal from './components/ImportModal'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Import" element={<ImportModal />} />
      </Routes>
    </Router>
  )
}
