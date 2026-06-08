interface Props {
  stats: any;
  onRestart: () => void;
  onGoHome: () => void;
  audioEnabled: boolean;
}

export default function ReflectPhase({ stats, onRestart, onGoHome }: Props) {
  return (
    <div className="reflect-phase">
      <div className="reflect-card">
        <h2 className="reflect-card-title">Great Job!</h2>
        <p className="reflect-sublabel mb-4">You completed the Regrouping Quest!</p>
        <div className="flex gap-4 justify-center mt-4">
          <button className="btn btn-primary" onClick={onRestart}>Play Again</button>
          <button className="btn btn-secondary" onClick={onGoHome}>Home</button>
        </div>
      </div>
    </div>
  );
}
