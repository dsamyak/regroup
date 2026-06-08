interface Props {
  onStart: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ New Adventure</div>
      <h1 className="intro-title">Regrouping Quest</h1>
      <p className="intro-desc">Learn addition and subtraction with carrying and borrowing!</p>
      <button className="btn btn-primary intro-start-btn" onClick={onStart}>
        Start Quest
      </button>
    </div>
  );
}
