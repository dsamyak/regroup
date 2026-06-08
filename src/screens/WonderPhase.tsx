interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function WonderPhase({ onComplete }: Props) {
  return (
    <div className="wonder-phase">
      <div className="wonder-content">
        <h2 className="wonder-question-text">Have you ever wondered what happens when a column adds up to more than 9?</h2>
        <button className="btn btn-wonder visible" onClick={onComplete}>Let's Find Out!</button>
      </div>
    </div>
  );
}
