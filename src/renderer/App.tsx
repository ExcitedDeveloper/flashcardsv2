import { MemoryRouter as Router, Routes, Route } from 'react-router'
import CardList from './components/CardList/CardList'
import EditCard from './components/EditCard/EditCard'
import './App.css'

export default function App() {
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
