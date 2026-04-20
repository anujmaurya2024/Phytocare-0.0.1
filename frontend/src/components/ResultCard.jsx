export default function ResultCard({ result }) {
  if (!result) return null

  const { disease, confidence, all_scores, demo_mode, info } = result
  const topClass = disease

  const severityBadge = {
    none:     { cls: 'badge-success', label: '✅ Healthy' },
    moderate: { cls: 'badge-warning', label: '⚠️ Moderate' },
    severe:   { cls: 'badge-danger',  label: '🚨 Severe' },
  }
  const badge = severityBadge[info.severity] || severityBadge.none

  return (
    <div className="result-section" id="result-card">
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20, fontSize: '1rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Diagnosis Result
      </h3>

      <div className="result-card">
        {/* Header */}
        <div className="result-header">
          <span className="result-disease-icon">{info.icon}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div className="result-disease-name">{disease}</div>
              <span className={`badge ${badge.cls}`}>{badge.label}</span>
            </div>
            <div className="result-scientific">{info.scientific_name}</div>
          </div>
        </div>

        {/* Confidence meter */}
        <div className="confidence-block">
          <div className="confidence-label">
            <span>Confidence</span>
            <span className="confidence-pct">{confidence.toFixed(1)}%</span>
          </div>
          <div className="confidence-track">
            <div
              className="confidence-fill"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* All class scores */}
        <div className="all-scores">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 12 }}>
            All Class Scores
          </p>
          {Object.entries(all_scores).map(([cls, pct]) => (
            <div className="score-row" key={cls}>
              <span className="score-name">{cls}</span>
              <div className="score-bar-track">
                <div
                  className={`score-bar-fill ${cls === topClass ? 'top' : 'other'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="score-pct">{pct}%</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="info-block">
          <h4>About this Condition</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {info.description}
          </p>
        </div>

        {/* Symptoms */}
        <div className="info-block">
          <h4>Symptoms</h4>
          <ul className="symptom-list">
            {info.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        {/* Treatment */}
        <div className="info-block">
          <h4>Recommended Actions</h4>
          <ul className="treatment-list">
            {info.treatment.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
