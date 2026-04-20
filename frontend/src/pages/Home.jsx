import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import StatsBar from '../components/StatsBar'
import DiseaseCard from '../components/DiseaseCard'
import Footer from '../components/Footer'

const DISEASES = {
  'Early Blight': {
    scientific_name: 'Alternaria solani',
    description: 'A common fungal disease affecting potatoes and tomatoes — dark brown spots with concentric rings on older leaves. Spreads rapidly in warm, humid conditions.',
    symptoms: ['Dark brown circular spots with concentric rings', 'Yellow halo surrounding lesions', 'Premature leaf drop', 'Lesions on stems and fruits'],
    treatment: ['Apply fungicides containing chlorothalonil', 'Remove infected debris', 'Improve air circulation', 'Rotate crops every 2–3 years'],
    severity: 'moderate',
    severity_color: '#f59e0b',
    icon: '🍂',
  },
  'Late Blight': {
    scientific_name: 'Phytophthora infestans',
    description: 'One of the most destructive plant diseases — caused the Irish Potato Famine. Water-soaked lesions rapidly destroy entire potato and tomato plants under cool, moist conditions.',
    symptoms: ['Water-soaked grayish-green lesions', 'White mold on leaf undersides', 'Dark brown greasy-looking patches', 'Rotting tubers and fruits'],
    treatment: ['Apply copper-based fungicides immediately', 'Destroy all infected plant material', 'Avoid working in wet fields', 'Use certified disease-free seeds'],
    severity: 'severe',
    severity_color: '#ef4444',
    icon: '⚠️',
  },
  'Tomato Leaf Mold': {
    scientific_name: 'Fulvia fulva',
    description: 'A fungal disease specific to tomatoes, thriving in high-humidity greenhouse environments. Causes yellow patches above and olive-green mold below leaves.',
    symptoms: ['Pale yellow spots on upper leaf surface', 'Olive-green to gray mold on leaf underside', 'Leaves curl and wither', 'Reduced fruit set in severe cases'],
    treatment: ['Improve greenhouse ventilation', 'Apply fungicides (mancozeb, chlorothalonil)', 'Remove and destroy infected leaves', 'Plant resistant tomato varieties'],
    severity: 'moderate',
    severity_color: '#f59e0b',
    icon: '🍃',
  },
}

const FEATURES = [
  { icon: '⚡', title: 'Instant Results', desc: 'Get a diagnosis in under a second. Our optimized CNN runs inference in real-time so you never wait.' },
  { icon: '🎯', title: '98% Accuracy', desc: 'Trained on the PlantVillage dataset with data augmentation and MobileNetV2 transfer learning.' },
  { icon: '💊', title: 'Treatment Plans', desc: 'Every diagnosis comes with actionable treatment recommendations from agricultural experts.' },
  { icon: '🍅', title: 'Tomato & Potato', desc: 'Supports both potato and tomato crops — the two most economically affected by blight diseases.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Images are processed server-side and never stored. Your data stays yours.' },
  { icon: '🌍', title: 'Open Research', desc: 'Built on open datasets and open-source tools. Reproducible science for everyone.' },
]

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✦ Why PhytoCare</div>
            <h2>Built for precision agriculture</h2>
            <p>From field to diagnosis in seconds — designed for farmers, agronomists, and researchers.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i} id={`feature-${i}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Preview */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✦ Disease Library</div>
            <h2>Multiple conditions, one scan</h2>
            <p>Our model detects these potato &amp; tomato plant conditions with industry-leading precision.</p>
          </div>
          <div className="diseases-grid">
            {Object.entries(DISEASES).map(([name, info]) => (
              <DiseaseCard key={name} name={name} info={info} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            padding: '60px 48px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.05))',
            border: '1px solid rgba(34,197,94,0.25)',
            textAlign: 'center',
            boxShadow: '0 0 80px rgba(34,197,94,0.08)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔬</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
              Ready to scan your crop?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '1rem' }}>
              Upload any potato or tomato leaf photo and get an instant AI diagnosis — free, fast, and accurate.
            </p>
            <Link to="/diagnose" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }} id="home-cta-btn">
              🌿 Start Free Diagnosis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
