import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Diagnose from './pages/Diagnose'
import Diseases from './pages/Diseases'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/diagnose" element={<Diagnose />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/about"    element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
