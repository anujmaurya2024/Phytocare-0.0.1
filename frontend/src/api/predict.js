const API_BASE = 'http://localhost:8000'

/**
 * Send a leaf image to the FastAPI backend and get disease prediction.
 * @param {File} imageFile
 * @param {{ lat: number|null, lng: number|null }} [coords] - Optional geolocation
 * @returns {Promise<PredictionResult>}
 */
export async function predictDisease(imageFile, coords = null) {
  const formData = new FormData()
  formData.append('file', imageFile)

  // Attach geolocation if available (Feature 3)
  if (coords?.lat != null && coords?.lng != null) {
    formData.append('lat', coords.lat)
    formData.append('lng', coords.lng)
  }

  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || `Server error: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch all supported diseases and their metadata.
 */
export async function getDiseases() {
  const response = await fetch(`${API_BASE}/diseases`)
  if (!response.ok) throw new Error('Failed to fetch disease data')
  return response.json()
}

/**
 * Health check — returns whether the model is loaded.
 */
export async function getHealth() {
  const response = await fetch(`${API_BASE}/health`)
  if (!response.ok) throw new Error('API unreachable')
  return response.json()
}
