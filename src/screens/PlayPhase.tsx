interface Props {
  onComplete: (stats: any) => void;
  audioEnabled: boolean;
}

export default function PlayPhase({ onComplete }: Props) {
  return (
    <div className="play-phase">
      <div className="glass-card text-center">
        <h2 className="play-title">Play the Game</h2>
        <p className="play-subtitle mb-4">Solve the regrouping challenges!</p>
        <button className="btn btn-primary" onClick={() => onComplete({ score: 100 })}>Finish Game</button>
      </div>
    </div>
  );
}
