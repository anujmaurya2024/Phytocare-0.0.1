import { useState, useEffect } from 'react'
import UploadCard from '../components/UploadCard'
import ResultCard from '../components/ResultCard'
import Footer from '../components/Footer'

// ─── Feature 3: Geolocation Hook ─────────────────────────────────────────────

function useGeolocation() {
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const [geoStatus, setGeoStatus] = useState('idle') // idle | granted | denied | unavailable

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable')
      return
    }

    setGeoStatus('idle')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setGeoStatus('granted')
      },
      (err) => {
        console.warn('[PhytoCare] Geolocation denied or unavailable:', err.message)
        setGeoStatus('denied')
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5 * 60 * 1000, // cache for 5 minutes
      }
    )
  }, [])

  return { coords, geoStatus }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Diagnose() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Feature 3: capture user location for heat-map data
  const { coords, geoStatus } = useGeolocation()

  return (
    <>
      <div className="upload-page">
        <div className="container">
          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 16 }}>
              🔬 AI Diagnosis
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Scan Your <span className="text-gradient">Plant Leaf</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Upload a clear photo of your potato or tomato leaf and our CNN will detect Early Blight, Late Blight, Leaf Mold, and more.
            </p>

            {/* Feature 3: Subtle geolocation status badge */}
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
              {geoStatus === 'granted' && (
                <span
                  id="geo-status-badge"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.75rem', color: 'var(--primary)',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 20, padding: '4px 12px', fontWeight: 600,
                  }}
                >
                  📍 Location tracking active
                  <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>
                    ({coords.lat?.toFixed(4)}°, {coords.lng?.toFixed(4)}°)
                  </span>
                </span>
              )}
              {geoStatus === 'denied' && (
                <span
                  id="geo-status-badge"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.75rem', color: 'var(--text-subtle)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 20, padding: '4px 12px',
                  }}
                >
                  📍 Location unavailable — scan data won't include coordinates
                </span>
              )}
              {geoStatus === 'unavailable' && (
                <span
                  id="geo-status-badge"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.75rem', color: 'var(--text-subtle)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 20, padding: '4px 12px',
                  }}
                >
                  📍 Geolocation not supported by this browser
                </span>
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="upload-layout">
            {/* Left — Upload */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 14 }}>
                Step 1 — Upload Leaf Image
              </p>
              {/* Pass coords to UploadCard for Feature 3 */}
              <UploadCard onResult={setResult} onLoading={setLoading} coords={coords} />
            </div>

            {/* Right — Result or placeholder */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 14 }}>
                Step 2 — Diagnosis
              </p>

              {loading && (
                <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                  <div className="spinner" />
                  <p className="loading-text">Analyzing leaf tissue with AI…</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 8 }}>
                    Running CNN inference on your image
                  </p>
                </div>
              )}

              {!loading && result && <ResultCard result={result} />}

              {!loading && !result && (
                <div style={{
                  padding: '60px 40px', textAlign: 'center',
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                  border: '2px dashed var(--border)', minHeight: 340,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12
                }}>
                  <span style={{ fontSize: '3rem' }}>🩺</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                    Your diagnosis will appear here
                  </p>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                    Upload a leaf image to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* API status hint */}
          <div style={{ marginTop: 48, padding: '16px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
              💡 Backend API must be running at{' '}
              <code style={{ color: 'var(--primary)', background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: 4 }}>
                http://localhost:8000
              </code>
              {' '}— run{' '}
              <code style={{ color: 'var(--accent)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>
                uvicorn main:app --reload
              </code>
              {' '}in the <code style={{ color: 'var(--accent)' }}>backend/</code> folder.
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
