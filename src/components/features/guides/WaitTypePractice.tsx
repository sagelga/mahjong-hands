import { useState, useCallback } from 'react';
import { MAHJONG_TILES } from '../../../lib/tiles';
import './WaitTypePractice.css';

// ── Tile lookup ───────────────────────────────────────────────────────────────

const TILE_MAP = new Map(MAHJONG_TILES.map(t => [t.id, t]));
const tile = (id: string) => TILE_MAP.get(id)!;

// ── Data ──────────────────────────────────────────────────────────────────────

interface Question {
  waitLabel: string;
  handIds: string[];     // tiles already in hand (shown)
  correctIds: string[];  // winning tile IDs (one or two)
  optionIds: string[];   // all 4 clickable option tile IDs
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    waitLabel: 'Two-Sided Wait',
    handIds: ['c6', 'c7'],
    correctIds: ['c5', 'c8'],
    optionIds: ['c4', 'c5', 'c8', 'c9'],
    explanation: '6 and 7 are consecutive middle tiles with open ends on both sides — draw 5 to form 5-6-7, or draw 8 to form 6-7-8. Two winning tiles. This is the strongest wait type.',
  },
  {
    waitLabel: 'Middle Wait',
    handIds: ['d3', 'd5'],
    correctIds: ['d4'],
    optionIds: ['d2', 'd4', 'd6', 'd7'],
    explanation: 'There is exactly one gap between 3 and 5. Only 4 can complete the sequence 3-4-5. This is a Middle Wait (Kanchan) — just one winning tile.',
  },
  {
    waitLabel: 'Edge Wait',
    handIds: ['b1', 'b2'],
    correctIds: ['b3'],
    optionIds: ['b3', 'b4', 'b5', 'b9'],
    explanation: '1-2 sits at the lowest edge of the suit. The only possible extension is rightward — draw 3 to make 1-2-3. There is no 0. Edge Waits are the weakest with just one winning tile.',
  },
  {
    waitLabel: 'Pair Wait (Tanki)',
    handIds: ['h7'],
    correctIds: ['h7'],
    optionIds: ['h5', 'h6', 'h7', 'h1'],
    explanation: 'A lone Red Dragon is waiting for its twin to complete the pair (the "eyes"). This is a Tanki wait — you have four complete sets and just need any matching tile for the pair.',
  },
  {
    waitLabel: 'Double-Pair Wait',
    handIds: ['c4', 'c4', 'd7', 'd7'],
    correctIds: ['c4', 'd7'],
    optionIds: ['c4', 'd7', 'c5', 'd8'],
    explanation: 'Two separate pairs remain. Either tile upgrades its pair to a Pung while the other becomes the eyes — so both 4-Character and 7-Dot are winning tiles. This is a Double-Pair (Shanpon) Wait.',
  },
  {
    waitLabel: 'Edge Wait',
    handIds: ['c8', 'c9'],
    correctIds: ['c7'],
    optionIds: ['c6', 'c7', 'd8', 'd9'],
    explanation: '8-9 sits at the high edge of the suit. The only extension is leftward — draw 7 to make 7-8-9. There is no 10 in Mahjong. One winning tile.',
  },
  {
    waitLabel: 'Two-Sided Wait',
    handIds: ['b4', 'b5'],
    correctIds: ['b3', 'b6'],
    optionIds: ['b2', 'b3', 'b6', 'b7'],
    explanation: '4-5 are middle tiles. Draw 3 to make 3-4-5, or draw 6 to make 4-5-6. Two winning tiles — always aim for this when you can.',
  },
  {
    waitLabel: 'Middle Wait',
    handIds: ['b5', 'b7'],
    correctIds: ['b6'],
    optionIds: ['b4', 'b6', 'b8', 'b9'],
    explanation: 'The gap between 5 and 7 fits exactly one tile. Only 6 can bridge it to make 5-6-7. Middle Wait — one winning tile.',
  },
  {
    waitLabel: 'Pair Wait (Tanki)',
    handIds: ['d9'],
    correctIds: ['d9'],
    optionIds: ['d7', 'd8', 'd9', 'c9'],
    explanation: 'A single 9-Dot is waiting for its pair. Draw another 9-Dot to complete the eyes. This is a Tanki (Pair) Wait — one winning tile.',
  },
  {
    waitLabel: 'Double-Pair Wait',
    handIds: ['h1', 'h1', 'h5', 'h5'],
    correctIds: ['h1', 'h5'],
    optionIds: ['h1', 'h2', 'h5', 'h6'],
    explanation: 'East Wind and White Dragon each form a pair. Drawing either one promotes it to a Pung while the other pair becomes the eyes. Two winning tiles — Double-Pair (Shanpon) Wait.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function WaitTypePractice() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const question = QUESTIONS[questionIndex];
  const isAnswered = selectedId !== null;
  const isCorrect = selectedId !== null && question.correctIds.includes(selectedId);

  const handleSelect = useCallback((id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
    if (question.correctIds.includes(id)) {
      setScore(s => s + 1);
    }
  }, [isAnswered, question.correctIds]);

  const handleNext = useCallback(() => {
    setResults(r => [...r, isCorrect]);
    if (questionIndex + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setQuestionIndex(i => i + 1);
      setSelectedId(null);
    }
  }, [questionIndex, isCorrect]);

  const handleRestart = useCallback(() => {
    setQuestionIndex(0);
    setSelectedId(null);
    setScore(0);
    setFinished(false);
    setResults([]);
  }, []);

  // Results screen
  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const grade =
      pct === 100 ? { label: 'Perfect!', color: '#10b981' } :
      pct >= 80   ? { label: 'Great job!', color: '#34d399' } :
      pct >= 60   ? { label: 'Getting there', color: '#f59e0b' } :
                    { label: 'Keep practicing', color: '#ef4444' };

    return (
      <div className="wtp-card wtp-result">
        <div className="wtp-result-score" style={{ color: grade.color }}>
          {score}/{QUESTIONS.length}
        </div>
        <div className="wtp-result-grade" style={{ color: grade.color }}>{grade.label}</div>
        <p className="wtp-result-sub">
          You identified <strong>{score}</strong> out of <strong>{QUESTIONS.length}</strong> winning tiles correctly.
        </p>
        <div className="wtp-result-dots">
          {results.map((ok, i) => (
            <span key={i} className={`wtp-dot ${ok ? 'wtp-dot--correct' : 'wtp-dot--wrong'}`} />
          ))}
        </div>
        <button className="wtp-btn-next" onClick={handleRestart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="wtp-card">
      {/* Progress bar */}
      <div className="wtp-progress-bar">
        <div className="wtp-progress-fill" style={{ width: `${(questionIndex / QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Header */}
      <div className="wtp-header">
        <span className="wtp-label">Practice Quiz</span>
        <span className="wtp-counter">{questionIndex + 1} / {QUESTIONS.length}</span>
        <span className="wtp-score">Score: {score}</span>
      </div>

      {/* Hand */}
      <div className="wtp-question">
        <p className="wtp-prompt">Which tile wins this hand?</p>
        <div className="wtp-hand">
          {question.handIds.map((id, i) => (
            <img
              key={i}
              src={tile(id).image}
              alt={tile(id).name}
              className="wtp-hand-tile"
            />
          ))}
          <div className="wtp-ghost-tile">?</div>
        </div>
        {isAnswered && (
          <div className="wtp-wait-label">
            {isCorrect ? '✓' : '✗'} {question.waitLabel}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="wtp-options">
        {question.optionIds.map(id => {
          const t = tile(id);
          let state = '';
          if (isAnswered) {
            if (question.correctIds.includes(id)) state = 'correct';
            else if (id === selectedId) state = 'wrong';
            else state = 'dim';
          }
          return (
            <button
              key={id}
              className={`wtp-option ${state}`}
              onClick={() => handleSelect(id)}
              disabled={isAnswered}
              title={t.name}
            >
              <img src={t.image} alt={t.name} className="wtp-option-img" />
              <span className="wtp-option-name">{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className={`wtp-feedback ${isCorrect ? 'wtp-feedback--correct' : 'wtp-feedback--wrong'}`}>
          <span className="wtp-feedback-badge">
            {isCorrect
              ? 'Correct!'
              : `Not quite — the winning tile${question.correctIds.length > 1 ? 's are' : ' is'} highlighted above`}
          </span>
          <p className="wtp-feedback-text">{question.explanation}</p>
          <button className="wtp-btn-next" onClick={handleNext}>
            {questionIndex + 1 < QUESTIONS.length ? 'Next →' : 'See Results →'}
          </button>
        </div>
      )}
    </div>
  );
}
