import { useState, useCallback, useEffect } from 'react';
import { sounds } from '../utils/audio';

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const STATIONS = [
  { id: 0, title: 'Addition with Carrying', subtitle: 'Concrete Regrouping', icon: '➕' },
  { id: 1, title: 'Subtraction with Borrowing', subtitle: 'Visual Borrowing', icon: '➖' },
  { id: 2, title: 'Number Sentence', subtitle: 'Abstract Math', icon: '📝' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Addition with Carrying (Concrete)
// ═══════════════════════════════════════════════════
function Station1({ onNext }: { audioEnabled: boolean; onNext: () => void }) {
  const [round, setRound] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [onesResult, setOnesResult] = useState('');
  const [tensResult, setTensResult] = useState('');
  const [carry, setCarry] = useState('');
  const [step, setStep] = useState(0); // 0=ones, 1=carry, 2=tens, 3=done
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Generate problems that require carrying (ones add to > 9)
    const a = randInt(15, 49);
    const b = randInt(15, 49);
    const onesSum = (a % 10) + (b % 10);
    if (onesSum > 9) {
      setNum1(a); setNum2(b);
    } else {
      // Ensure carrying is needed
      const newA = a - (a % 10) + randInt(5, 9);
      const newB = b - (b % 10) + randInt(5, 9);
      setNum1(newA); setNum2(newB);
    }
    setOnesResult(''); setTensResult(''); setCarry('');
    setStep(0); setFeedback('');
  }, [round]);

  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  const tens1 = Math.floor(num1 / 10);
  const tens2 = Math.floor(num2 / 10);
  const onesSum = ones1 + ones2;
  const needsCarry = onesSum > 9;
  const correctOnes = onesSum % 10;
  const correctCarry = needsCarry ? 1 : 0;
  const correctTens = tens1 + tens2 + correctCarry;

  const handleNumClick = (n: string) => {
    if (step === 0) {
      // Entering ones result
      if (parseInt(n) === correctOnes) {
        setOnesResult(n);
        sounds.correct();
        setFeedback(`✅ ${ones1} + ${ones2} = ${onesSum}. Write ${correctOnes}!`);
        if (needsCarry) {
          setStep(1);
        } else {
          setStep(2);
        }
      } else {
        sounds.wrong();
        setFeedback(`❌ Try again! What is ${ones1} + ${ones2}? Write only the ones digit.`);
      }
    } else if (step === 1) {
      // Entering carry
      if (parseInt(n) === correctCarry) {
        setCarry(n);
        sounds.correct();
        setFeedback(`✅ We carry ${correctCarry} ten to the tens column!`);
        setStep(2);
      } else {
        sounds.wrong();
        setFeedback('❌ How many tens do we carry? (Hint: it\'s 1!)');
      }
    } else if (step === 2) {
      // Entering tens result
      if (parseInt(n) === correctTens) {
        setTensResult(n);
        sounds.correct();
        setFeedback(`🎉 ${tens1} + ${tens2}${needsCarry ? ' + 1 (carried)' : ''} = ${correctTens}. The answer is ${num1 + num2}!`);
        setStep(3);
      } else {
        sounds.wrong();
        setFeedback(`❌ Try again! What is ${tens1} + ${tens2}${needsCarry ? ' + 1 (carry)' : ''}?`);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>➕ Addition with Carrying</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Solve <strong style={{ color: 'var(--gold)' }}>{num1} + {num2}</strong> step by step!
      </p>

      {/* Place Value Visualization */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '24px 0', fontFamily: 'var(--font-display)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            {step >= 1 && needsCarry && <span style={{ color: 'var(--coral)', fontWeight: 700 }}>carry {carry || '?'}</span>}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8, letterSpacing: 1 }}>TENS</div>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{tens1}</div>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3, borderBottom: '3px solid var(--gold)', paddingBottom: 4 }}>+ {tens2}</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: step >= 3 ? 'var(--green)' : 'var(--text-muted)', lineHeight: 1.5 }}>
            {tensResult || '?'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>&nbsp;</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8, letterSpacing: 1 }}>ONES</div>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{ones1}</div>
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3, borderBottom: '3px solid var(--gold)', paddingBottom: 4 }}>+ {ones2}</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: onesResult ? 'var(--green)' : 'var(--text-muted)', lineHeight: 1.5 }}>
            {onesResult || '?'}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="simulate-tip">
        {step === 0 && `Step 1: Add the ones column. What is ${ones1} + ${ones2}? Write the ones digit.`}
        {step === 1 && `Step 2: ${onesSum} has a ten! How many tens do we carry?`}
        {step === 2 && `Step 3: Add the tens column${needsCarry ? ' (don\'t forget the carry!)' : ''}. What is ${tens1} + ${tens2}${needsCarry ? ' + 1' : ''}?`}
        {step === 3 && `🎉 ${num1} + ${num2} = ${num1 + num2}!`}
      </div>

      {feedback && <p style={{ color: feedback.startsWith('✅') || feedback.startsWith('🎉') ? 'var(--green-light)' : 'var(--red-light)', marginBottom: 16, fontSize: '0.95rem' }}>{feedback}</p>}

      {/* Number Pad */}
      {step < 3 && (
        <div className="number-pad">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))}>{n}</button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div style={{ animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Subtraction with Borrowing (Visual)
// ═══════════════════════════════════════════════════
function Station2({ onNext }: { audioEnabled: boolean; onNext: () => void }) {
  const [round, setRound] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [onesResult, setOnesResult] = useState('');
  const [tensResult, setTensResult] = useState('');
  const [borrowed, setBorrowed] = useState(false);
  const [step, setStep] = useState(0); // 0=check, 1=borrow, 2=ones, 3=tens, 4=done
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Generate problems that require borrowing
    const a = randInt(31, 69);
    const b = randInt(13, 29);
    if ((a % 10) < (b % 10)) {
      setNum1(a); setNum2(b);
    } else {
      // Ensure borrowing is needed
      const newA = a - (a % 10) + randInt(1, 4);
      const newB = b - (b % 10) + randInt(5, 9);
      setNum1(Math.max(newA, newB + 10)); setNum2(newB);
    }
    setOnesResult(''); setTensResult('');
    setBorrowed(false); setStep(0); setFeedback('');
  }, [round]);

  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  const tens1 = Math.floor(num1 / 10);
  const tens2 = Math.floor(num2 / 10);
  const needsBorrow = ones1 < ones2;
  const borrowedOnes = needsBorrow ? ones1 + 10 : ones1;
  const borrowedTens = needsBorrow ? tens1 - 1 : tens1;
  const correctOnes = borrowedOnes - ones2;
  const correctTens = borrowedTens - tens2;

  const handleBorrow = () => {
    setBorrowed(true);
    sounds.correct();
    setFeedback(`✅ We borrow 1 ten! ${tens1} tens → ${tens1 - 1} tens, ${ones1} ones → ${ones1 + 10} ones`);
    setStep(2);
  };

  const handleNumClick = (n: string) => {
    if (step === 0) {
      // Can we subtract ones?
      setFeedback(`🤔 Can we take ${ones2} from ${ones1}? ${ones1 < ones2 ? 'No! We need to borrow.' : 'Yes!'}`);
      setStep(needsBorrow ? 1 : 2);
    } else if (step === 2) {
      if (parseInt(n) === correctOnes) {
        setOnesResult(n);
        sounds.correct();
        setFeedback(`✅ ${borrowedOnes} − ${ones2} = ${correctOnes}!`);
        setStep(3);
      } else {
        sounds.wrong();
        setFeedback(`❌ Try again! What is ${borrowedOnes} − ${ones2}?`);
      }
    } else if (step === 3) {
      if (parseInt(n) === correctTens) {
        setTensResult(n);
        sounds.correct();
        setFeedback(`🎉 ${num1} − ${num2} = ${num1 - num2}!`);
        setStep(4);
      } else {
        sounds.wrong();
        setFeedback(`❌ Try again! What is ${borrowedTens} − ${tens2}?`);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>➖ Subtraction with Borrowing</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Solve <strong style={{ color: 'var(--coral)' }}>{num1} − {num2}</strong> step by step!
      </p>

      {/* Place Value Visualization */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '24px 0', fontFamily: 'var(--font-display)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8, letterSpacing: 1 }}>TENS</div>
          <div style={{ fontSize: '2rem', color: borrowed ? 'var(--coral)' : 'var(--text-primary)', lineHeight: 1.3, textDecoration: borrowed ? 'line-through' : 'none' }}>{tens1}</div>
          {borrowed && <div style={{ fontSize: '1.5rem', color: 'var(--green)', lineHeight: 1 }}>{borrowedTens}</div>}
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3, borderBottom: '3px solid var(--coral)', paddingBottom: 4 }}>− {tens2}</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: tensResult ? 'var(--green)' : 'var(--text-muted)', lineHeight: 1.5 }}>
            {tensResult || '?'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 8, letterSpacing: 1 }}>ONES</div>
          <div style={{ fontSize: '2rem', color: borrowed ? 'var(--coral)' : 'var(--text-primary)', lineHeight: 1.3, textDecoration: borrowed ? 'line-through' : 'none' }}>{ones1}</div>
          {borrowed && <div style={{ fontSize: '1.5rem', color: 'var(--green)', lineHeight: 1 }}>{borrowedOnes}</div>}
          <div style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1.3, borderBottom: '3px solid var(--coral)', paddingBottom: 4 }}>− {ones2}</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: onesResult ? 'var(--green)' : 'var(--text-muted)', lineHeight: 1.5 }}>
            {onesResult || '?'}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="simulate-tip">
        {step === 0 && `Step 1: Look at the ones column. Can we take ${ones2} from ${ones1}? Tap a number or tap Check below.`}
        {step === 1 && `We can't take ${ones2} from ${ones1}! We need to borrow a ten. Tap "Borrow" below.`}
        {step === 2 && `Step 2: Now subtract the ones. What is ${borrowedOnes} − ${ones2}?`}
        {step === 3 && `Step 3: Subtract the tens. What is ${borrowedTens} − ${tens2}?`}
        {step === 4 && `🎉 ${num1} − ${num2} = ${num1 - num2}!`}
      </div>

      {feedback && <p style={{ color: feedback.startsWith('✅') || feedback.startsWith('🎉') ? 'var(--green-light)' : feedback.startsWith('🤔') ? 'var(--gold-light)' : 'var(--red-light)', marginBottom: 16, fontSize: '0.95rem' }}>{feedback}</p>}

      {step === 0 && (
        <button className="btn btn-outline btn-sm" onClick={() => handleNumClick('')} style={{ marginBottom: 16 }}>🔍 Check Ones Column</button>
      )}

      {step === 1 && (
        <button className="btn btn-primary" onClick={handleBorrow} style={{ marginBottom: 16, animation: 'bounceIn 0.5s' }}>
          🔄 Borrow a Ten!
        </button>
      )}

      {(step === 2 || step === 3) && (
        <div className="number-pad">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))}>{n}</button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div style={{ animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`} onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Mixed Number Sentence (Abstract)
// ═══════════════════════════════════════════════════
function Station3({ onComplete }: { audioEnabled: boolean; onComplete: () => void }) {
  const [isAddition, setIsAddition] = useState(true);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [round, setRound] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const add = Math.random() > 0.5;
    setIsAddition(add);
    if (add) {
      const a = randInt(18, 59);
      const b = randInt(13, 39);
      // Ensure carrying
      if ((a % 10) + (b % 10) > 9) { setNum1(a); setNum2(b); }
      else { setNum1(a - (a % 10) + randInt(5, 9)); setNum2(b - (b % 10) + randInt(5, 9)); }
    } else {
      const a = randInt(41, 79);
      const b = randInt(13, 29);
      // Ensure borrowing
      if ((a % 10) < (b % 10)) { setNum1(a); setNum2(b); }
      else { setNum1(a - (a % 10) + randInt(1, 3)); setNum2(b - (b % 10) + randInt(6, 9)); }
    }
    setInputVal(''); setShowHint(false); setDone(false);
  }, [round]);

  const answer = isAddition ? num1 + num2 : num1 - num2;

  const handleNumClick = (n: string) => {
    if (done) return;
    const newVal = inputVal + n;
    setInputVal(newVal);
    sounds.click();

    if (parseInt(newVal) === answer) {
      setDone(true);
      sounds.correct();
    } else if (newVal.length >= String(answer).length) {
      sounds.wrong();
      setTimeout(() => setInputVal(''), 500);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📝 Number Sentence</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Solve the {isAddition ? 'addition (with carrying)' : 'subtraction (with borrowing)'}! Use the number pad.
      </p>

      <div className="sentence-row">
        <span className="given-value">{num1}</span>
        <span className="sentence-label">{isAddition ? '+' : '−'}</span>
        <span className="given-value">{num2}</span>
        <span className="sentence-equals">=</span>
        <div className={`blank-input ${done ? 'correct' : inputVal ? 'filled' : ''}`}>
          {inputVal || (done ? answer : '?')}
        </div>
      </div>

      <button className="btn btn-sm btn-outline" onClick={() => setShowHint(!showHint)} style={{ marginBottom: 24 }}>
        {showHint ? 'Hide Hint' : 'Show Hint 💡'}
      </button>

      {showHint && (
        <div className="simulate-tip" style={{ animation: 'slideUp 0.3s', maxWidth: 400, margin: '0 auto 24px' }}>
          {isAddition
            ? `Ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}${(num1 % 10) + (num2 % 10) > 9 ? ' (carry 1!)' : ''}. Tens: ${Math.floor(num1 / 10)} + ${Math.floor(num2 / 10)}${(num1 % 10) + (num2 % 10) > 9 ? ' + 1' : ''}`
            : `Can we take ${num2 % 10} from ${num1 % 10}? ${(num1 % 10) < (num2 % 10) ? 'No! Borrow a ten.' : 'Yes!'} Ones: ${(num1 % 10) < (num2 % 10) ? (num1 % 10) + 10 : num1 % 10} − ${num2 % 10}. Tens: ${(num1 % 10) < (num2 % 10) ? Math.floor(num1 / 10) - 1 : Math.floor(num1 / 10)} − ${Math.floor(num2 / 10)}`
          }
        </div>
      )}

      {!done && (
        <div className="number-pad">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))}>{n}</button>
          ))}
          <button className="num-pad-btn" onClick={() => setInputVal('')} style={{ gridColumn: 'span 2' }}>Clear</button>
        </div>
      )}

      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          <p style={{ color: 'var(--green-light)', fontSize: '1.1rem', marginBottom: 16 }}>
            🎉 {num1} {isAddition ? '+' : '−'} {num2} = {answer}!
          </p>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound(r => r + 1)}>Try Another →</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={onComplete}>🎉 Complete Simulation!</button>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
interface Props {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function SimulatePhase({ onComplete, audioEnabled }: Props) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  useEffect(() => {
    if (audioEnabled) {
      import('../utils/narration').then(m => {
        let txt = '';
        if (station === 0) txt = "Addition with Carrying. Let's solve it step by step!";
        if (station === 1) txt = "Subtraction with Borrowing. Can we take it away? Let's find out!";
        if (station === 2) txt = "Number Sentence. Solve the problem using what you've learned!";
        m.playSimulateNarration(txt);
      });
    }
  }, [station, audioEnabled]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore carrying & borrowing — step by step!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
