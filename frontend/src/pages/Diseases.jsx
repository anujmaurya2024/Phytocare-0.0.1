import DiseaseCard from '../components/DiseaseCard'
import Footer from '../components/Footer'

const DISEASES = {
  // ── Shared diseases (affect both potato & tomato) ──────────────────────────
  'Early Blight': {
    plant: 'Potato & Tomato',
    scientific_name: 'Alternaria solani',
    description: 'Early blight is a common fungal disease caused by Alternaria solani affecting both potato and tomato crops. It typically appears as dark brown spots with concentric rings on older leaves, creating a distinctive target board pattern. The disease spreads rapidly in warm, humid conditions and can significantly reduce yield if left untreated.',
    symptoms: [
      'Dark brown circular spots with concentric rings',
      'Yellow halo surrounding lesions',
      'Premature leaf drop',
      'Lesions on stems, tubers, and fruits in severe cases',
    ],
    treatment: [
      'Apply fungicides containing chlorothalonil or mancozeb',
      'Remove and destroy infected plant debris',
      'Improve air circulation by proper plant spacing',
      'Avoid overhead irrigation to reduce leaf wetness',
      'Rotate crops — avoid planting in the same spot for 2–3 years',
    ],
    severity: 'moderate',
    severity_color: '#f59e0b',
    icon: '🍂',
  },
  'Late Blight': {
    plant: 'Potato & Tomato',
    scientific_name: 'Phytophthora infestans',
    description: 'Late blight, caused by Phytophthora infestans, is one of the most destructive plant diseases in history — it caused the Irish Potato Famine of the 1840s. It devastates both potato and tomato crops. Water-soaked lesions rapidly turn dark brown and destroy entire plants within days under cool, moist conditions. Immediate action is critical.',
    symptoms: [
      'Water-soaked, grayish-green lesions on leaves',
      'White mold visible on leaf undersides in humid conditions',
      'Dark brown, greasy-looking patches that spread rapidly',
      'Rotting tubers and fruits with reddish-brown internal discoloration',
    ],
    treatment: [
      'Apply copper-based or systemic fungicides immediately',
      'Remove and destroy all infected plant material',
      'Avoid working in fields when plants are wet',
      'Use certified disease-free seed potatoes or seedlings',
      'Plant resistant varieties where possible',
      'Monitor weather — disease thrives at 10–25°C with high humidity',
    ],
    severity: 'severe',
    severity_color: '#ef4444',
    icon: '⚠️',
  },

  // ── Tomato-specific diseases ────────────────────────────────────────────────
  'Tomato Leaf Mold': {
    plant: 'Tomato',
    scientific_name: 'Fulvia fulva',
    description: 'Tomato Leaf Mold is a fungal disease caused by Fulvia fulva, primarily affecting tomatoes in high-humidity greenhouse and field environments. It begins as pale yellow spots on the upper leaf surface with a characteristic olive-green to gray mold layer on the underside. Severe infections can cause significant yield loss.',
    symptoms: [
      'Pale yellow to greenish-yellow spots on upper leaf surface',
      'Olive-green to gray mold growth on leaf underside',
      'Leaves curl inward and eventually wither and drop',
      'Reduced fruit set and quality in severe cases',
    ],
    treatment: [
      'Improve ventilation — reduce relative humidity below 85%',
      'Apply fungicides (mancozeb, chlorothalonil, or copper-based)',
      'Remove and destroy infected leaves promptly',
      'Avoid overhead watering; use drip irrigation',
      'Plant resistant tomato varieties (e.g., Cf-resistant cultivars)',
    ],
    severity: 'moderate',
    severity_color: '#f59e0b',
    icon: '🍃',
  },
  'Tomato Bacterial Spot': {
    plant: 'Tomato',
    scientific_name: 'Xanthomonas campestris pv. vesicatoria',
    description: 'Bacterial Spot is caused by Xanthomonas bacteria and affects tomato leaves, stems, and fruits. It is particularly damaging in warm, wet weather and can survive in infected seed and crop debris. The disease reduces photosynthesis and causes premature defoliation, exposing fruits to sunscald.',
    symptoms: [
      'Small, water-soaked, circular spots on leaves — turning dark brown',
      'Spots with yellow halo on leaf margins',
      'Raised, rough, scab-like lesions on green fruit',
      'Premature defoliation exposing fruits to sunscald',
    ],
    treatment: [
      'Use copper-based bactericides at first sign of disease',
      'Apply mancozeb in combination with copper for better control',
      'Use certified disease-free seeds — treat seeds with hot water (50°C, 25 min)',
      'Avoid overhead irrigation and working in wet fields',
      'Rotate crops and clean equipment between farms',
    ],
    severity: 'moderate',
    severity_color: '#f59e0b',
    icon: '🔴',
  },

  // ── Healthy states ─────────────────────────────────────────────────────────
  'Healthy': {
    plant: 'Potato & Tomato',
    scientific_name: 'Solanum spp.',
    description: 'Great news! Your plant appears healthy with no signs of disease. The leaf structure, coloration, and texture are consistent with a thriving plant. Continue your current care regimen and monitor regularly for early signs of stress.',
    symptoms: [
      'Deep green, vibrant leaf color',
      'No lesions, spots, or discoloration',
      'Firm, upright stems',
      'Normal leaf shape and texture',
    ],
    treatment: [
      'Maintain balanced fertilization (NPK ratio)',
      'Water at the base to avoid leaf wetness',
      'Scout regularly for early pest or disease signs',
      'Ensure proper soil drainage',
      'Continue crop rotation practices',
    ],
    severity: 'none',
    severity_color: '#22c55e',
    icon: '✅',
  },
}

export default function Diseases() {
  return (
    <>
      <div className="diseases-page">
        <div className="container">
          <div className="section-header">
            <div className="section-tag" style={{ justifyContent: 'center' }}>✦ Disease Library</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Plant Disease <span className="text-gradient">Reference</span>
            </h1>
            <p>
              A comprehensive guide to the conditions PhytoCare detects across potato and tomato crops — symptoms, causes, and treatment strategies.
            </p>
          </div>

          {/* Crop filter badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 48, flexWrap: 'wrap' }}>
            {['All Crops', '🥔 Potato', '🍅 Tomato'].map((label, i) => (
              <span key={i} style={{
                padding: '6px 18px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
                border: '1px solid var(--border)', color: i === 0 ? 'var(--primary)' : 'var(--text-subtle)',
                background: i === 0 ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)',
                borderColor: i === 0 ? 'rgba(16,185,129,0.4)' : 'var(--border)',
                cursor: 'default',
              }}>
                {label}
              </span>
            ))}
          </div>

          <div className="diseases-grid">
            {Object.entries(DISEASES).map(([name, info]) => (
              <DiseaseCard key={name} name={name} info={info} />
            ))}
          </div>

          {/* Full detail cards */}
          <div style={{ marginTop: 80 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 40, color: 'var(--text)' }}>
              Detailed Profiles
            </h2>
            {Object.entries(DISEASES).map(([name, info]) => (
              <div
                key={name}
                className="card"
                style={{ padding: '40px', marginBottom: 28, borderRadius: 'var(--radius-xl)' }}
                id={`detail-${name.replace(/\s+/g,'').toLowerCase()}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <span style={{ fontSize: '2.5rem' }}>{info.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>{name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>{info.scientific_name}</p>
                  </div>
                  {/* Crop tag */}
                  <span style={{
                    fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, fontWeight: 600,
                    background: 'rgba(16,185,129,0.1)', color: 'var(--primary)',
                    border: '1px solid rgba(16,185,129,0.3)', marginLeft: 8,
                  }}>
                    {info.plant}
                  </span>
                  <span className={`badge ${info.severity === 'severe' ? 'badge-danger' : info.severity === 'moderate' ? 'badge-warning' : 'badge-success'}`} style={{ marginLeft: 'auto' }}>
                    {info.severity === 'severe' ? '🚨 Severe' : info.severity === 'moderate' ? '⚠️ Moderate' : '✅ Healthy'}
                  </span>
                </div>

                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 28, fontSize: '0.93rem' }}>{info.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 14 }}>
                      Symptoms
                    </p>
                    <ul className="symptom-list">
                      {info.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 14 }}>
                      Treatment
                    </p>
                    <ul className="treatment-list">
                      {info.treatment.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
