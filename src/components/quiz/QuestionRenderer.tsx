import { useState, useCallback } from 'react';

interface QuestionProps {
  question: {
    questionText: string;
    options: (string | number)[];
    correctAnswer: string | number;
  };
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

export default function QuestionRenderer({ question, onAnswer, disabled }: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  const handleOptionClick = useCallback((option: string | number) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--coral)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
        🧱 REGROUPING
      </div>
      <p className="question-text">{question.questionText}</p>

      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
