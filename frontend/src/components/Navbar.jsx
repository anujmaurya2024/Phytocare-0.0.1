import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <NavLink to="/" className="navbar-logo">
        <div className="logo-icon">🌿</div>
        <span>Phyto<span style={{ color: 'var(--primary)' }}>Care</span></span>
      </NavLink>

      <ul className="navbar-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/diagnose">Diagnose</NavLink></li>
        <li><NavLink to="/diseases">Diseases</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li>
          <NavLink to="/diagnose" className="navbar-cta">
            🔬 Scan Now
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
