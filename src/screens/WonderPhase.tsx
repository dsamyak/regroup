import { useState, useEffect } from 'react';

const WONDER_QUESTIONS = [
  {
    question: "You have 27 marbles and your friend gives you 15 more. The ones column adds up to 12! But a column can only hold 9. What do you do?",
    subtext: "When a column adds up to more than 9, we regroup — we carry the extra ten to the next column!",
    emoji: "🔢",
    bgEmojis: ["🔢", "🧱", "✨", "➕"],
  },
  {
    question: "You have 43 stickers but want to give away 18. You can't take 8 from 3! How can you solve this?",
    subtext: "When we can't subtract, we borrow — we break a ten into ten ones!",
    emoji: "⭐",
    bgEmojis: ["⭐", "🎯", "🧮", "➖"],
  },
  {
    question: "A baker has 56 cupcakes and makes 37 more. How does he figure out the total when 6 + 7 = 13?",
    subtext: "He writes down the 3 and carries the 1 ten to the tens column. That's regrouping!",
    emoji: "🧁",
    bgEmojis: ["🧁", "🎂", "✨", "🔢"],
  },
  {
    question: "You have 32 apples, but need to give 15 to a friend. Can you take 5 from 2?",
    subtext: "No! You need to borrow a ten. The 3 tens becomes 2 tens, and the 2 ones becomes 12 ones!",
    emoji: "🍎",
    bgEmojis: ["🍎", "🧺", "🔢", "💡"],
  },
  {
    question: "What happens when you add 48 + 36? The ones column gives you 14. Where does the extra 10 go?",
    subtext: "The 10 gets carried up to the tens column. That is called carrying or regrouping!",
    emoji: "🧮",
    bgEmojis: ["🧮", "➕", "🔟", "🌟"],
  },
];

interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function WonderPhase({ onComplete, audioEnabled }: Props) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(1);
      if (audioEnabled) {
        import('../utils/narration').then(m => {
          m.playWonderNarration(wonder.question, wonder.subtext);
        });
      }
    }, 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [audioEnabled, wonder]);

  const handleDiscover = () => {
    setTimeout(() => onComplete(), 600);
  };

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🧙</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
