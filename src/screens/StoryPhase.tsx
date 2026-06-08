interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function StoryPhase({ onComplete }: Props) {
  return (
    <div className="story-phase">
      <div className="story-card">
        <div className="story-text-section">
          <h2 className="story-title">The Map Discovery</h2>
          <p className="story-text revealed">John, Mike, Sarah, and Priya found a mysterious map!</p>
          <button className="btn btn-primary mt-4" onClick={onComplete}>Next</button>
        </div>
      </div>
    </div>
  );
}
