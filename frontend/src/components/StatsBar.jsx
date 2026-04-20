export default function StatsBar() {
  const stats = [
    { value: '98%',   label: 'Model Accuracy' },
    { value: '4,000+', label: 'Training Images' },
    { value: '2',     label: 'Crops Supported' },
    { value: '<1s',   label: 'Inference Time' },
  ]
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i} id={`stat-item-${i}`}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
