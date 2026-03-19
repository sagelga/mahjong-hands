import { useState, useMemo, useCallback, useEffect } from 'react';
import { MAHJONG_TILES, type TileDef } from '../../../lib/tiles';
import { generateScenario, type PracticeScenario, type ExposedSet } from '../../../lib/handGenerator';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import './PracticePage.css';

function isAnswerCorrect(selected: Set<string>, correct: Set<string>): boolean {
  return selected.size === correct.size && [...selected].every(id => correct.has(id));
}

// Non-flower tiles grouped by suit for the answer grid
const ANSWER_TILES = {
  Characters: MAHJONG_TILES.filter(t => t.suit === 'Characters'),
  Dots:       MAHJONG_TILES.filter(t => t.suit === 'Dots'),
  Bamboo:     MAHJONG_TILES.filter(t => t.suit === 'Bamboo'),
  Honors:     MAHJONG_TILES.filter(t => t.suit === 'Honors'),
};

const PLAYER_COLORS = [
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #a855f7, #7c3aed)',
  'linear-gradient(135deg, #f97316, #ea580c)',
];

// ─── Small display tile (read-only) ──────────────────────────────────────────
function DisplayTile({ tile, size = 'md' }: { tile: TileDef; size?: 'sm' | 'md' }) {
  return (
    <div className={`quiz-tile quiz-tile--${size}`}>
      <img src={tile.image} alt={tile.name} className="quiz-tile-img" />
    </div>
  );
}

// ─── Answer grid tile (selectable) ───────────────────────────────────────────
function AnswerTile({
  tile,
  state,
  onToggle,
}: {
  tile: TileDef;
  state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'missed';
  onToggle: () => void;
}) {
  return (
    <button
      className={`answer-tile answer-tile--${state}`}
      onClick={onToggle}
      title={tile.name}
      aria-label={tile.name}
      aria-pressed={state === 'selected' || state === 'correct' || state === 'incorrect'}
    >
      <img src={tile.image} alt={tile.name} className="answer-tile-img" />
      {state === 'correct'   && <span className="answer-tile-badge answer-tile-badge--correct">✓</span>}
      {state === 'incorrect' && <span className="answer-tile-badge answer-tile-badge--incorrect">✗</span>}
      {state === 'missed'    && <span className="answer-tile-badge answer-tile-badge--missed">!</span>}
    </button>
  );
}

// ─── Answer grid (all non-flower tiles) ──────────────────────────────────────
function AnswerGrid({
  selectedIds,
  correctIds,
  revealed,
  onToggle,
}: {
  selectedIds: Set<string>;
  correctIds?: Set<string>;
  revealed: boolean;
  onToggle: (id: string) => void;
}) {
  function getState(tile: TileDef): 'idle' | 'selected' | 'correct' | 'incorrect' | 'missed' {
    const isSelected = selectedIds.has(tile.id);
    const isCorrect  = correctIds?.has(tile.id) ?? false;
    if (!revealed) return isSelected ? 'selected' : 'idle';
    if (isSelected && isCorrect)  return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (!isSelected && isCorrect) return 'missed';
    return 'idle';
  }

  return (
    <div className="answer-grid">
      {Object.entries(ANSWER_TILES).map(([suit, tiles]) => (
        <div key={suit} className="answer-grid-row">
          <span className="answer-grid-suit-label">{suit}</span>
          <div className="answer-grid-tiles">
            {tiles.map(tile => (
              <AnswerTile
                key={tile.id}
                tile={tile}
                state={getState(tile)}
                onToggle={() => onToggle(tile.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Opponent panel ───────────────────────────────────────────────────────────
function OpponentPanel({
  label,
  sets,
  color,
}: {
  label: string;
  sets: ExposedSet[];
  color: string;
}) {
  return (
    <div className="opponent-card" style={{ '--player-color': color } as React.CSSProperties}>
      <div className="opponent-card-body">
        <span className="opponent-label">{label}</span>
        <div className="opponent-sets">
          {sets.length === 0 ? (
            <span className="opponent-empty">No exposed sets</span>
          ) : (
            sets.map((set, gi) => (
              <div key={gi} className="opponent-set">
                <span className="opponent-set-type">{set.type}</span>
                <div className="opponent-set-tiles">
                  {set.tiles.map((tile, ti) => (
                    <DisplayTile key={ti} tile={tile} size="sm" />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main quiz page ───────────────────────────────────────────────────────────
export default function PracticePage() {
  useEffect(() => {
    document.title = 'Tenpai Practice - Mahjong Hand Builder';
  }, []);

  const [scenario, setScenario]      = useState<PracticeScenario>(() => generateScenario());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quizState, setQuizState]    = useState<'answering' | 'revealed'>('answering');
  const [stats, setStats]            = useState({ correct: 0, total: 0 });

  const correctIds = useMemo(
    () => new Set(scenario.waitingTiles.map(wt => wt.tile.id)),
    [scenario],
  );

  const isCorrect = useMemo(
    () => quizState === 'revealed' && isAnswerCorrect(selectedIds, correctIds),
    [quizState, selectedIds, correctIds],
  );

  const toggleTile = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const checkAnswer = useCallback(() => {
    setStats(prev => ({
      correct: prev.correct + (isAnswerCorrect(selectedIds, correctIds) ? 1 : 0),
      total: prev.total + 1,
    }));
    setQuizState('revealed');
  }, [selectedIds, correctIds]);

  const nextQuestion = useCallback(() => {
    setScenario(generateScenario());
    setSelectedIds(new Set());
    setQuizState('answering');
  }, []);

  const roundNumber = stats.total + (quizState === 'answering' ? 1 : 0);
  const accuracy    = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  return (
    <PageContent className="practice-page">

      <PageHeader
        title="Tenpai Practice"
        subtitle="Look at the situation below and find all tiles that complete your hand."
      />

      {/* ── Stats bar ── */}
      <div className="practice-stats">
        <div className="practice-stat-card">
          <span className="practice-stat-value">{roundNumber}</span>
          <span className="practice-stat-label">Round</span>
        </div>
        <div className="practice-stat-card">
          <span className="practice-stat-value">{stats.correct}</span>
          <span className="practice-stat-label">Correct</span>
        </div>
        <div className="practice-stat-card">
          <span className="practice-stat-value">{accuracy !== null ? `${accuracy}%` : '—'}</span>
          <span className="practice-stat-label">Accuracy</span>
        </div>
      </div>

      {/* ── Your hand ── */}
      <div className="practice-section">
        <h2>
          Your Hand
          <span className="practice-count-badge">{scenario.hand.length} tiles</span>
        </h2>
        <div className="practice-hand-area">
          <div className="practice-hand-row">
            {scenario.hand.map((tile, i) => (
              <DisplayTile key={i} tile={tile} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Discard pile ── */}
      <div className="practice-section">
        <h2>
          Discard Pile
          <span className="practice-count-badge">{scenario.discards.length} tiles</span>
        </h2>
        <div className="practice-hand-area">
          {scenario.discards.length === 0 ? (
            <span className="practice-empty-msg">No discards yet</span>
          ) : (
            <div className="practice-discard-row">
              {scenario.discards.map((tile, i) => (
                <DisplayTile key={i} tile={tile} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Opponents ── */}
      <div className="practice-section">
        <h2>Opponents' Exposed Sets</h2>
        <div className="practice-opponents-grid">
          {scenario.opponents.map((opp, i) => (
            <OpponentPanel
              key={opp.label}
              label={opp.label}
              sets={opp.sets}
              color={PLAYER_COLORS[i % PLAYER_COLORS.length]}
            />
          ))}
        </div>
      </div>

      {/* ── Answer section ── */}
      {quizState === 'answering' ? (
        <div className="practice-section">
          <h2>Which tile(s) complete your hand?</h2>
          <div className="practice-card practice-card--accent">
            <div className="practice-card-body">

              <div className="practice-answer-hint">
                Select every tile that would let you win, then click <strong>Check Answer</strong>.
              </div>

              {selectedIds.size > 0 && (
                <div className="practice-selection-preview">
                  <span className="practice-selection-label">Your pick:</span>
                  {[...selectedIds].map(id => {
                    const t = MAHJONG_TILES.find(x => x.id === id);
                    return t ? <DisplayTile key={id} tile={t} size="sm" /> : null;
                  })}
                </div>
              )}

              <AnswerGrid
                selectedIds={selectedIds}
                revealed={false}
                onToggle={toggleTile}
              />

              <button
                className="practice-btn-primary"
                onClick={checkAnswer}
                disabled={selectedIds.size === 0}
              >
                Check Answer
              </button>

            </div>
          </div>
        </div>
      ) : (
        <div className="practice-section">
          <div className={`practice-card practice-card--${isCorrect ? 'accent' : 'danger'}`}>
            <div className="practice-card-body">

              <div className="practice-result-header">
                <div className={`practice-result-icon practice-result-icon--${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <p className="practice-result-title">
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
              </div>

              <p className="practice-result-sub">
                {scenario.waitingTiles.length === 1
                  ? 'This hand is waiting for 1 tile type:'
                  : `This hand is waiting for ${scenario.waitingTiles.length} tile types:`}
              </p>

              <div className="practice-waiting-row">
                {scenario.waitingTiles.map(({ tile, remaining }) => (
                  <div
                    key={tile.id}
                    className={`practice-reveal-tile${remaining === 0 ? ' practice-reveal-tile--exhausted' : ''}`}
                  >
                    <img src={tile.image} alt={tile.name} className="practice-reveal-img" />
                    <span className="practice-reveal-name">{tile.name}</span>
                    <span className="practice-reveal-remaining">{remaining} left</span>
                  </div>
                ))}
              </div>

              <div className="practice-result-grid-label">Your selections:</div>
              <AnswerGrid
                selectedIds={selectedIds}
                correctIds={correctIds}
                revealed={true}
                onToggle={() => {}}
              />

              <button className="practice-btn-primary" onClick={nextQuestion}>
                Next Question →
              </button>

            </div>
          </div>
        </div>
      )}

    </PageContent>
  );
}
