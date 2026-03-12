import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LightingRound.css';
import './LightningRoundMock.css';

const SAMPLE_QUESTION = {
  question: 'What does a "bull market" refer to in trading?',
  options: [
    'A market where prices are falling',
    'A market where prices are rising',
    'A market with high volatility',
    'A market with low trading volume',
  ],
  correctIndex: 1,
  category: 'Trading',
};

type MockState = 'lobby' | 'playing' | 'results';

export default function LightningRoundMock() {
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState<MockState>('lobby');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (i: number) => {
    if (isAnswered) return;
    setSelectedAnswer(i);
    setIsAnswered(true);
  };

  const switchState = (s: MockState) => {
    setActiveState(s);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="lrm">
      {/* Tab switcher */}
      <div className="lrm__tabs">
        <span className="lrm__tabs-label">Preview state:</span>
        {(['lobby', 'playing', 'results'] as MockState[]).map(s => (
          <button
            key={s}
            className={`lrm__tab ${activeState === s ? 'lrm__tab--active' : ''}`}
            onClick={() => switchState(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button className="lrm__live-btn" onClick={() => navigate('/lightning-round')}>
          ⚡ Go Live
        </button>
      </div>

      {/* LOBBY STATE */}
      {activeState === 'lobby' && (
        <div className="lr">
          <div className="lr__lobby">
            <div className="lr__lobby-icon">⚡</div>
            <h1 className="lr__lobby-title">Lightning Round</h1>
            <p className="lr__lobby-sub">
              10 rapid-fire questions. 10 seconds each. How fast can you go?
            </p>
            <div className="lr__lobby-stats">
              <div className="lr__stat">
                <span className="lr__stat-value">10</span>
                <span className="lr__stat-label">Questions</span>
              </div>
              <div className="lr__stat">
                <span className="lr__stat-value">10s</span>
                <span className="lr__stat-label">Per Question</span>
              </div>
              <div className="lr__stat">
                <span className="lr__stat-value">+1,000</span>
                <span className="lr__stat-label">Max XP</span>
              </div>
            </div>
            <div className="lr__lobby-rules">
              <p>⚡ Answer faster for bonus XP</p>
              <p>🏆 Perfect score earns +500 bonus XP</p>
              <p>🔀 Random questions from all 4 modules</p>
            </div>
            <button className="lr__start-btn" onClick={() => switchState('playing')}>
              ⚡ Start Lightning Round
            </button>
          </div>
        </div>
      )}

      {/* PLAYING STATE */}
      {activeState === 'playing' && (
        <div className={`lr ${selectedAnswer === SAMPLE_QUESTION.correctIndex && isAnswered ? 'lr--flash-correct' : ''} ${selectedAnswer !== null && selectedAnswer !== SAMPLE_QUESTION.correctIndex && isAnswered ? 'lr--flash-wrong' : ''}`}>
          <div className="lr__game">
            <div className="lr__header">
              <span className="lr__category-badge">{SAMPLE_QUESTION.category}</span>
              <span className="lr__question-count">3 / 10</span>
              <div className="lr__score-display">⚡ 250 XP</div>
            </div>

            <div className="lr__timer-wrap">
              <div
                className="lr__timer-bar"
                style={{
                  width: '60%',
                  background: 'var(--accent)',
                  transition: 'none',
                }}
              />
            </div>
            <div className="lr__timer-label" style={{ color: 'var(--accent)' }}>6s</div>

            <div className="lr__question-card">
              <p className="lr__question-text">{SAMPLE_QUESTION.question}</p>
            </div>

            <div className="lr__answers">
              {SAMPLE_QUESTION.options.map((option, i) => {
                let cls = 'lr__answer';
                if (isAnswered) {
                  if (i === SAMPLE_QUESTION.correctIndex) cls += ' lr__answer--correct';
                  else if (i === selectedAnswer) cls += ' lr__answer--wrong';
                } else if (selectedAnswer === i) {
                  cls += ' lr__answer--selected';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                  >
                    <span className="lr__answer-letter">{String.fromCharCode(65 + i)}</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="lrm__next-hint">
                {selectedAnswer === SAMPLE_QUESTION.correctIndex
                  ? '✅ Correct! Next question loading…'
                  : '❌ Wrong! The correct answer was B.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS STATE */}
      {activeState === 'results' && (
        <div className="lr">
          <div className="lr__results">
            <div className="lr__results-trophy">🌟</div>
            <h1 className="lr__results-title">Round Complete!</h1>
            <div className="lr__results-score">
              <span className="lr__results-fraction">8 / 10</span>
              <span className="lr__results-pct">80% correct</span>
            </div>
            <div className="lr__results-xp">+875 XP added to your account!</div>
            <div className="lr__results-actions">
              <button className="lr__start-btn" onClick={() => switchState('lobby')}>
                Play Again
              </button>
              <button className="lr__home-btn" onClick={() => navigate('/')}>
                Back to Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
