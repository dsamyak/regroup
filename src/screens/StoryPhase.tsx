import { useState, useEffect, useCallback } from 'react';

const STORY_SLIDES = [
  {
    image: '/images/story_treasure_map.png',
    title: "The Mysterious Map",
    text: 'John, Mike, Sarah, and Priya discover a glowing treasure map hidden inside the school library! But the map is locked with math puzzles. To unlock each piece, they must master the ancient art of Regrouping!',
    highlight: '"To find the treasure, we must learn to regroup!"',
    mascotText: "What an adventure awaits! 🗺️",
  },
  {
    image: '/images/story_place_value.png',
    title: "Understanding Place Value",
    text: 'Mike explains: "Every number has columns! The Ones column is for single blocks. The Tens column is for rods of ten. The Hundreds column is for big flats of one hundred. When we add or subtract, we work column by column!"',
    highlight: '"Ones → Tens → Hundreds — each column has its place!"',
    mascotText: "Place value is the key! 🧱",
  },
  {
    image: '/images/story_carrying.png',
    title: "The Magic of Carrying",
    text: 'Sarah shows everyone: "When we add 27 + 15, the ones column gives us 7 + 5 = 12. But 12 is too many for one column! So we keep the 2 ones and carry the 1 ten to the tens column. That is called carrying or regrouping in addition!"',
    highlight: '"7 + 5 = 12 → Write 2, carry 1 ten!"',
    mascotText: "Carry the extra ten! ➕",
  },
  {
    image: '/images/story_borrowing.png',
    title: "The Secret of Borrowing",
    text: '"But what about subtraction?" asks Priya. "When we solve 42 − 17, we can\'t take 7 from 2! So we borrow a ten from the tens column. The 4 tens become 3 tens, and the 2 ones become 12 ones. Now we can subtract: 12 − 7 = 5!"',
    highlight: '"Can\'t subtract? Borrow a ten! 42 − 17 = 25"',
    mascotText: "Borrow to make it work! ➖",
  },
  {
    image: '/images/story_bridge.png',
    title: "The Practice Bridge",
    text: 'John says: "Now we must cross the Practice Bridge! Each stone has a regrouping puzzle. We need to carry when adding and borrow when subtracting. If we get them right, the bridge lights up and we get closer to the treasure!"',
    highlight: '"Practice makes perfect — carry and borrow!"',
    mascotText: "Let's cross together! 🌉",
  },
  {
    image: '/images/story_treasure.png',
    title: "Your Turn, Explorer!",
    text: 'Now you know the secrets of regrouping! When digits add up to more than 9, we carry. When we can\'t subtract, we borrow. The treasure awaits those who master these skills. Are you ready to begin your quest?',
    highlight: '"Carry in addition, borrow in subtraction — let\'s go!"',
    mascotText: "Ready to explore! ✨",
  },
];

interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function StoryPhase({ onComplete, audioEnabled }: Props) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => {
      setTextVis(true);
      if (audioEnabled) {
        import('../utils/narration').then(m => {
          m.playStoryNarration(s.text, s.highlight);
        });
      }
    }, 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide, audioEnabled, s]);

  const goNext = useCallback(() => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <img src={s.image} alt={s.title} className="story-image" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🧙</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
