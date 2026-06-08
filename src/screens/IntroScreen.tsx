import { useEffect } from 'react';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A regrouping mystery!' },
  { icon: '📖', label: 'Story', desc: 'See regrouping in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Try carrying & borrowing' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

interface Props {
  onStart: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  useEffect(() => {
    // Could add intro narration here
  }, []);

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨  · Grade 3 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Regrouping</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Addition & Subtraction</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 5.1 · Carrying & Borrowing in Multi-Digit Numbers
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🧙</div>
        <div className="speech-bubble">
          Let's master regrouping! 🔢
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to <strong style={{ color: 'var(--gold)' }}>carry</strong> in addition and <strong style={{ color: 'var(--coral)' }}>borrow</strong> in subtraction! Solve puzzles with place value blocks, unlock treasure, and become a regrouping master!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart} id="start-journey-btn">
        🚀 Begin Your Quest!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🧱</div>
          <div className="feature-card-label">Place Value Blocks</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
