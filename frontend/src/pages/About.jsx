import Footer from '../components/Footer'

const STACK = [
  { label: 'React.js', icon: '⚛️', desc: 'Frontend web application' },
  { label: 'FastAPI', icon: '⚡', desc: 'RESTful prediction API' },
  { label: 'TensorFlow', icon: '🧠', desc: 'CNN model training & inference' },
  { label: 'MobileNetV2', icon: '📐', desc: 'Transfer learning backbone' },
  { label: 'PlantVillage', icon: '🌿', desc: 'Training dataset (~54k images)' },
  { label: 'React Native', icon: '📱', desc: 'Cross-platform mobile app' },
]

const PIPELINE = [
  { title: 'Image Capture', desc: 'User uploads a potato leaf photo via web (React.js) or mobile (React Native) app.' },
  { title: 'API Request', desc: 'Image is sent as multipart/form-data to the FastAPI /predict endpoint.' },
  { title: 'Preprocessing', desc: 'Pillow resizes the image to 224×224. Pixel values are normalized to [0, 1].' },
  { title: 'CNN Inference', desc: 'MobileNetV2-backbone model produces a 3-class softmax probability vector.' },
  { title: 'Result Delivery', desc: 'FastAPI returns disease name, confidence score, and treatment metadata as JSON.' },
  { title: 'Result Display', desc: 'React renders the result card with animated confidence meter and treatment guide.' },
]

export default function About() {
  return (
    <>
      <div className="about-page">
        <div className="container">
          {/* Header */}
          <div className="section-header">
            <div className="section-tag" style={{ justifyContent: 'center' }}>✦ About This Project</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Phyto<span className="text-gradient">Care</span>
            </h1>
            <p>
              A full-stack ML platform for early detection of potato and tomato plant diseases,
              built to help farmers act fast and protect their harvest.
            </p>
          </div>

          {/* About grid */}
          <div className="about-grid" style={{ marginBottom: 80 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.7rem', marginBottom: 20, color: 'var(--text)' }}>
                The Problem
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24, fontSize: '0.95rem' }}>
                Potato and tomato blight diseases cause billions of dollars in crop losses annually. Early detection 
                is critical — but many farmers lack access to agronomists or lab testing. A misidentified 
                disease can lead to the wrong treatment, wasting money and accelerating crop loss.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--primary)' }}>PhytoCare</strong> puts expert-level diagnosis 
                in every farmer's pocket. Just photograph a leaf — our AI does the rest.
              </p>

              <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ padding: '20px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>98%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Validation Accuracy</div>
                </div>
                <div style={{ padding: '20px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>5</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Disease Classes</div>
                </div>
                <div style={{ padding: '20px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>&lt;1s</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Inference Time</div>
                </div>
              </div>
            </div>

            {/* Pipeline */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.7rem', marginBottom: 20, color: 'var(--text)' }}>
                How It Works
              </h2>
              {PIPELINE.map((step, i) => (
                <div className="pipeline-step" key={i} id={`pipeline-step-${i}`}>
                  <div className="pipeline-num">{i + 1}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: 80 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.7rem', marginBottom: 8, color: 'var(--text)' }}>
              Technology Stack
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.93rem' }}>
              Built with modern, production-grade tools across the full ML + web stack.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {STACK.map((t, i) => (
                <div
                  key={i}
                  className="tech-chip"
                  style={{ borderRadius: 'var(--radius)', padding: '20px 24px', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}
                  id={`tech-${t.label.toLowerCase().replace(/\./g,'')}`}
                >
                  <span style={{ fontSize: '1.6rem' }}>{t.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model architecture */}
          <div style={{ padding: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 20, color: 'var(--text)' }}>
              🧠 Model Architecture
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                {[
                  ['Base Model', 'MobileNetV2 (ImageNet pretrained)'],
                  ['Input Size', '224 × 224 × 3 (RGB)'],
                  ['Output Classes', 'Early & Late Blight · Leaf Mold · Bacterial Spot · Healthy'],
                  ['Activation', 'Softmax (5-class)'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>{k}</span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                {[
                  ['Training Epochs', '20 (+ 10 fine-tune)'],
                  ['Optimizer', 'Adam (lr=1e-4)'],
                  ['Loss', 'Categorical Crossentropy'],
                  ['Validation Accuracy', '~98%'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>{k}</span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
