import { useRef, useState, useCallback } from 'react'

// ─── Feature 4: Canvas-based Image Quality Analyser ──────────────────────────

/**
 * Analyses an image File using a Canvas element.
 * Returns { isDark, isBlurry, warnings[] }
 *
 * Blur  → Laplacian variance: high variance = sharp, low = blurry
 * Dark  → Mean luminance of all pixels (0–255 scale)
 */
async function analyseImageQuality(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      // Draw onto a small canvas for performance (max 256px wide)
      const SAMPLE_SIZE = 256
      const scale = Math.min(1, SAMPLE_SIZE / img.naturalWidth)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)

      const { data } = ctx.getImageData(0, 0, w, h)
      const total = w * h

      // ── Grayscale + Brightness ──────────────────────────────────────────
      const gray = new Float32Array(total)
      let sumLuminance = 0
      for (let i = 0; i < total; i++) {
        const r = data[i * 4]
        const g = data[i * 4 + 1]
        const b = data[i * 4 + 2]
        // Perceptual luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b
        gray[i] = lum
        sumLuminance += lum
      }
      const meanLuminance = sumLuminance / total

      // ── Laplacian Variance (blur measure) ──────────────────────────────
      // Kernel: [0,1,0, 1,-4,1, 0,1,0]
      let sumLap = 0
      let sumLapSq = 0
      let count = 0
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x
          const lap =
            gray[idx - w] +
            gray[idx + w] +
            gray[idx - 1] +
            gray[idx + 1] -
            4 * gray[idx]
          sumLap += lap
          sumLapSq += lap * lap
          count++
        }
      }
      const meanLap = sumLap / count
      const variance = sumLapSq / count - meanLap * meanLap

      const isDark = meanLuminance < 40          // luminance 0–255
      const isBlurry = variance < 100            // empirical threshold

      const warnings = []
      if (isDark) warnings.push('Image appears too dark — try better lighting')
      if (isBlurry) warnings.push('Image appears blurry — hold the camera steady')

      resolve({ isDark, isBlurry, warnings })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      // Can't analyse — let the upload proceed normally
      resolve({ isDark: false, isBlurry: false, warnings: [] })
    }

    img.src = url
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UploadCard({ onResult, onLoading, coords }) {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Feature 2: separate warning (amber) vs hard error (red)
  const [error, setError] = useState(null)
  const [warning, setWarning] = useState(null)

  // Feature 4: image quality warning (shown as overlay on preview)
  const [qualityWarnings, setQualityWarnings] = useState([])

  const inputRef = useRef()

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP).')
      return
    }

    setError(null)
    setWarning(null)
    setQualityWarnings([])

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    // ── Feature 4: Run quality check before uploading ─────────────────────
    const { warnings } = await analyseImageQuality(file)
    setQualityWarnings(warnings)

    setAnalyzing(true)
    onLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // ── Feature 3: Attach geolocation coordinates ─────────────────────
      if (coords?.lat != null && coords?.lng != null) {
        formData.append('lat', coords.lat)
        formData.append('lng', coords.lng)
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const detail = err.detail || `Server error ${res.status}`

        // Feature 2: inconclusive scan → amber warning, not a hard error
        if (res.status === 422 && detail === 'Inconclusive scan. Please ensure the leaf is well-lit and centered') {
          setWarning(detail)
        } else {
          setError(detail)
        }
        onResult(null)
        return
      }

      const data = await res.json()
      onResult(data)
    } catch (err) {
      setError(err.message || 'Could not reach the API. Make sure the backend is running on port 8000.')
      onResult(null)
    } finally {
      setAnalyzing(false)
      onLoading(false)
    }
  }, [onResult, onLoading, coords])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  const reset = () => {
    setPreview(null)
    setError(null)
    setWarning(null)
    setQualityWarnings([])
    onResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}${analyzing ? ' analyzing' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !analyzing && inputRef.current?.click()}
        id="upload-drop-zone"
      >
        {/* Scan animation overlay */}
        {analyzing && (
          <div className="scan-overlay">
            <div className="scan-line" />
          </div>
        )}

        {preview ? (
          <>
            {/* ── Feature 4: Preview + quality warning overlay ─────────── */}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <img src={preview} alt="Leaf preview" className="upload-preview" />

              {qualityWarnings.length > 0 && (
                <div
                  id="quality-warning-overlay"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(180,83,9,0.95) 0%, rgba(180,83,9,0.6) 70%, transparent 100%)',
                    padding: '20px 12px 10px',
                    borderRadius: '0 0 var(--radius) var(--radius)',
                    pointerEvents: 'none',
                  }}
                >
                  <p style={{
                    color: '#fef3c7',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    ⚠️ Low Quality Warning
                  </p>
                  {qualityWarnings.map((w, i) => (
                    <p key={i} style={{ color: '#fde68a', fontSize: '0.78rem', margin: '2px 0' }}>
                      {w}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {analyzing ? (
              <>
                <div className="spinner" />
                <p className="loading-text">🔬 Analyzing leaf tissue...</p>
              </>
            ) : (
              <button
                className="file-btn"
                style={{ marginTop: 8 }}
                onClick={(e) => { e.stopPropagation(); reset() }}
                id="upload-reset-btn"
              >
                ↩ Scan another leaf
              </button>
            )}
          </>
        ) : (
          <>
            <div className="upload-icon">🍃</div>
            <h3>Drop your leaf image here</h3>
            <p>Drag &amp; drop or click to browse. Make sure the leaf fills most of the frame.</p>
            <button className="file-btn" id="upload-browse-btn">Browse Files</button>
            <span className="upload-formats">JPG · PNG · WebP · max 10 MB</span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={onInputChange}
          id="upload-file-input"
        />
      </div>

      {/* ── Feature 2: Inconclusive scan — amber warning box ────────────── */}
      {warning && (
        <div
          id="upload-warning"
          style={{
            marginTop: 12,
            padding: '14px 18px',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.45)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🌤️</span>
          <div>
            <p style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.85rem', marginBottom: 4 }}>
              Inconclusive Scan
            </p>
            <p style={{ color: '#fde68a', fontSize: '0.82rem', lineHeight: 1.5 }}>
              {warning}
            </p>
          </div>
        </div>
      )}

      {/* Hard error — red box */}
      {error && (
        <div className="error-box" id="upload-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: 24, padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-subtle)', marginBottom: 12 }}>
          📷 Tips for best results
        </p>
        {[
          'Use natural daylight — avoid flash',
          'Capture a single leaf clearly in frame',
          'Avoid blurry or heavily shadowed images',
          'Both sides of the leaf are acceptable',
        ].map((tip, i) => (
          <p key={i} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--primary)' }}>✓</span> {tip}
          </p>
        ))}
      </div>
    </div>
  )
}
