import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import CardList from './components/CardList/CardList'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardList />} />
      </Routes>
    </Router>
  )
}
