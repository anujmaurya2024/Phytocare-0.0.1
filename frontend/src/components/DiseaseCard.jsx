import { Link } from 'react-router-dom'

const bannerColors = {
  'Early Blight': 'rgba(245,158,11,0.12)',
  'Late Blight':  'rgba(239,68,68,0.12)',
  'Healthy':      'rgba(34,197,94,0.12)',
}

export default function DiseaseCard({ name, info }) {
  const bg = bannerColors[name] || 'rgba(34,197,94,0.08)'

  return (
    <div className="disease-card" id={`disease-card-${name.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="disease-card-banner" style={{ background: bg }}>
        <span style={{ fontSize: '4rem', zIndex: 1, position: 'relative' }}>{info.icon}</span>
      </div>
      <div className="disease-card-body">
        <span className={`badge ${info.severity === 'severe' ? 'badge-danger' : info.severity === 'moderate' ? 'badge-warning' : 'badge-success'}`}
          style={{ marginBottom: 12 }}>
          {info.severity === 'severe' ? '🚨 Severe' : info.severity === 'moderate' ? '⚠️ Moderate' : '✅ Healthy'}
        </span>
        <h3>{name}</h3>
        <p className="disease-scientific">{info.scientific_name}</p>
        <p className="disease-desc">{info.description.slice(0, 160)}…</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {info.symptoms.slice(0, 2).map((s, i) => (
            <span key={i} style={{
              fontSize: '0.75rem', padding: '4px 10px', borderRadius: 99,
              background: 'var(--bg-glass)', border: '1px solid var(--border)',
              color: 'var(--text-muted)'
            }}>{s.slice(0, 30)}</span>
          ))}
        </div>

        <Link
          to="/diagnose"
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', marginTop: 20, fontSize: '0.85rem' }}
        >
          Diagnose for this →
        </Link>
      </div>
    </div>
  )
}
