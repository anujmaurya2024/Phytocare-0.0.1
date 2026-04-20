import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo">
          <div className="logo-icon">🌿</div>
          <span>Phyto<span style={{ color: 'var(--primary)' }}>Care</span></span>
        </div>
        <p>AI-powered potato &amp; tomato plant disease detection for farmers and researchers.</p>

        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/diagnose">Diagnose</Link></li>
          <li><Link to="/diseases">Diseases</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {['React.js', 'FastAPI', 'TensorFlow', 'PlantVillage Dataset'].map(t => (
            <span key={t} style={{
              fontSize: '0.75rem', padding: '4px 12px', borderRadius: 99,
              border: '1px solid var(--border)', color: 'var(--text-subtle)',
              background: 'var(--bg-card)'
            }}>{t}</span>
          ))}
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} PhytoCare · Built with 🌿 for precision agriculture
        </div>
      </div>
    </footer>
  )
}
