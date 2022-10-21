import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
