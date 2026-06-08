import { useState, useCallback, useEffect } from 'react';
import { sounds } from '../utils/audio';

const REFLECT_QUESTIONS = [
  {
    q: "You're adding 38 + 25. The ones column gives you 8 + 5 = 13. What do you do?",
    options: [
      { text: "Write 3 in ones, carry 1 ten to tens column", correct: true, emoji: "✅" },
      { text: "Write 13 in the ones column", correct: false, emoji: "❌" },
      { text: "Start over from the tens column", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "You're solving 52 − 27. Can you take 7 from 2 in the ones column?",
    options: [
      { text: "No — borrow a ten! 2 becomes 12, then 12 − 7 = 5", correct: true, emoji: "✅" },
      { text: "Yes — just subtract 2 − 7 = 5", correct: false, emoji: "❌" },
      { text: "Skip the ones column", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "What is regrouping?",
    options: [
      { text: "Trading 10 ones for 1 ten (or 1 ten for 10 ones)", correct: true, emoji: "🧱" },
      { text: "Putting numbers in alphabetical order", correct: false, emoji: "❌" },
      { text: "Multiplying numbers together", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "In 43 + 29, what is the ones digit of the answer?",
    options: [
      { text: "2 (because 3 + 9 = 12, write 2, carry 1)", correct: true, emoji: "🔢" },
      { text: "12", correct: false, emoji: "❌" },
      { text: "1", correct: false, emoji: "❓" },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I'm great at regrouping!", color: '#4caf50' },
  { emoji: '🙂', label: 'I can do most problems with carrying and borrowing!', color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning — I need more practice", color: '#42a5f5' },
];

interface Props {
  stats: any;
  onRestart: () => void;
  onGoHome: () => void;
  audioEnabled: boolean;
}

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }: Props) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number; duration: number }>>([]);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults as Record<string, any>).reduce((a: number, r: any) => a + (r.stars || 0), 0);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback((option: { text: string; correct: boolean; emoji: string }) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    if (option.correct) {
      setTeachCorrect(c => c + 1);
      sounds.correct();
    } else {
      sounds.wrong();
    }
    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1);
      }
    }, 1500);
  }, [teachAnswered, teachIdx]);

  const handleConfidenceSelect = useCallback((idx: number) => {
    setConfidence(idx);
    sounds.badge();
    setShowConfetti(true);
    setTimeout(() => setStep(2), 1000);
  }, []);

  useEffect(() => {
    if (audioEnabled) {
      import('../utils/narration').then(m => {
        if (step === 0) {
          m.playReflectNarration("Teach the mascot what you learned about regrouping!");
        } else if (step === 1) {
          m.playReflectNarration("How do you feel about regrouping? Be honest — every answer is great!");
        } else if (step === 2) {
          if (pct >= 80) m.playReflectNarration("Incredible! You are a Regrouping Master!");
          else if (pct >= 50) m.playReflectNarration("Great effort! Keep practicing carrying and borrowing!");
          else m.playReflectNarration("Good start! Try again to improve!");
        }
      });
    }
  }, [step, audioEnabled, pct]);

  // Step 0: Teach the Mascot
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Reflect</h3>
          <p className="reflect-sublabel">Teach the mascot what you learned about regrouping!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 70, height: 70, fontSize: '2rem' }}>🧙</div>
            <div className="speech-bubble" style={{ maxWidth: 280 }}>Can you help me? {rq.q}</div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => (
              <button key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)} disabled={teachAnswered}>
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Confidence
  if (step === 1) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <h3 className="reflect-card-title">How do you feel about regrouping?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Be honest — every answer is great!</p>
          <div className="confidence-grid">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button key={i} className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)} style={{ '--conf-color': c.color } as any}>
                <span className="confidence-emoji">{c.emoji}</span>
                <span className="confidence-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Certificate
  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`, animationDelay: `${p.delay}s`,
              backgroundColor: p.color, width: p.size, height: p.size,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Quest Complete!</h2>
        <p className="cert-subtitle">You finished all 5 phases of the Regrouping Quest!</p>
        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered}</span>
        </div>
        <div style={{ fontSize: '2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{ opacity: i <= Math.ceil(totalStars / 3) ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Max Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="cert-stat-label">Teaching</div>
          </div>
        </div>
        <div className="mascot-container" style={{ marginTop: 16 }}>
          <div className="mascot happy" style={{ width: 80, height: 80, fontSize: '2rem' }}>🧙</div>
          <div className="speech-bubble">
            {pct >= 80 ? 'Incredible! You are a Regrouping Master! 🏆' : pct >= 50 ? 'Great effort! Keep practicing carrying & borrowing! 💪' : 'Good start! Try again to improve! 📚'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-primary btn-lg" onClick={onRestart}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={onGoHome}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
