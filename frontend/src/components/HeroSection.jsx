import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            CNN-Powered Disease Detection
          </div>
          <h1>
            Detect Potato &amp; Tomato<br />
            Diseases <span className="text-gradient">Instantly</span>
          </h1>
          <p className="hero-sub">
            Upload a photo of your plant leaf and get an accurate AI-powered
            diagnosis in seconds. Powered by a CNN trained on the PlantVillage dataset
            with <strong style={{ color: 'var(--primary)' }}>98% accuracy</strong>.
          </p>
          <div className="hero-actions">
            <Link to="/diagnose" className="btn btn-primary" id="hero-scan-btn">
              🔬 Start Scanning
            </Link>
            <Link to="/diseases" className="btn btn-ghost" id="hero-learn-btn">
              Learn About Diseases →
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-orb">
          <span className="hero-orb-icon">🍅</span>
        </div>
      </div>
    </section>
  )
}
