interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function SimulatePhase({ onComplete }: Props) {
  return (
    <div className="simulate-phase">
      <div className="glass-card text-center">
        <h2 className="simulate-label">Simulate Regrouping</h2>
        <p className="simulate-sublabel mb-4">Let's try carrying the ten!</p>
        <button className="btn btn-primary" onClick={onComplete}>Next</button>
      </div>
    </div>
  );
}
