// Timed trivia: pulls pre-test questions from every module via GET /api/modules, shuffles 10,
// then scores speed + accuracy. XP persists through POST /api/lighting-round (typo kept for API compat).
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { QuizQuestion } from '../models/QuizQuestion';
import '../styles/LightingRound.css';

const QUESTION_TIME = 10;
const TOTAL_QUESTIONS = 10;
const XP_PER_CORRECT = 100;
const PERFECT_BONUS = 500;

type GameState = 'lobby' | 'countdown' | 'playing' | 'finished';

/** Fisher–Yates shuffle so each Lightning Round draw is a random subset of pool questions. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LightingRound() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [allQuestions, setAllQuestions] = useState<{ q: QuizQuestion; category: string }[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [gameState, setGameState] = useState<GameState>('lobby');
  const [questions, setQuestions] = useState<{ q: QuizQuestion; category: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch all questions once on mount
  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(modules => {
        const questions = modules.flatMap((module: any) =>
          module.pretest.map((q: any) => ({
            q: new QuizQuestion(q.question, q.options, q.correct, q.explanation),
            category: module.title
          }))
        );
        setAllQuestions(questions);
        setIsLoadingQuestions(false);
      })
      .catch(err => {
        console.warn('Failed to load questions', err);
        setLoadError(true);
        setIsLoadingQuestions(false);
      });
  }, []);

  /** Stops per-question and countdown intervals so we never leak timers on unmount or transitions. */
  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  /** Moves to the next prompt or ends the round when we've hit TOTAL_QUESTIONS. */
  const advanceQuestion = useCallback(() => {
    clearTimers();
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME);

    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= TOTAL_QUESTIONS) {
        setGameState('finished');
        return prev;
      }
      return next;
    });
  }, []);

  // 3-2-1 overlay before the first question; then flip to `playing` and the question timer starts.
  useEffect(() => {
    if (gameState !== 'countdown') return;
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setGameState('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimers();
  }, [gameState]);

  // Per-question countdown: when it hits zero we treat it as a wrong answer and auto-advance.
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;
    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsAnswered(true);
          setFlashWrong(true);
          setTimeout(() => setFlashWrong(false), 400);
          setTimeout(() => advanceQuestion(), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimers();
  }, [gameState, currentIndex, isAnswered, advanceQuestion]);

  /** Picks a fresh random batch, resets score state, then enters the 3-2-1 countdown phase. */
  const startGame = () => {
    clearTimers();
    const picked = shuffle(allQuestions).slice(0, TOTAL_QUESTIONS);
    setQuestions(picked);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setXpEarned(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME);
    setGameState('countdown');
  };

  /** Freezes the timer, applies scoring + flash feedback, then schedules the next question. */
  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    clearTimers();
    setSelectedAnswer(index);
    setIsAnswered(true);

    const correct = questions[currentIndex].q.isCorrectAnswer(index);
    if (correct) {
      const timeBonus = Math.round((timeLeft / QUESTION_TIME) * 50);
      const gained = XP_PER_CORRECT + timeBonus;
      setScore(prev => prev + gained);
      setCorrectCount(prev => prev + 1);
      setFlashCorrect(true);
      setTimeout(() => setFlashCorrect(false), 400);
    } else {
      setFlashWrong(true);
      setTimeout(() => setFlashWrong(false), 400);
    }

    setTimeout(() => advanceQuestion(), 1200);
  };

  // Persist total XP once when leaving `playing` (depends on score + perfect-run bonus).
  useEffect(() => {
    if (gameState !== 'finished') return;

    const isPerfect = correctCount === TOTAL_QUESTIONS;
    const totalXp = score + (isPerfect ? PERFECT_BONUS : 0);
    setXpEarned(totalXp);

    if (user && totalXp > 0) {
      fetch('/api/lighting-round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xpEarned: totalXp }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.experiencePoints !== undefined) {
            setUser({ ...user, experiencePoints: data.experiencePoints });
          }
        })
        .catch(console.warn);
    }
  }, [gameState]);

  const currentQ = questions[currentIndex];
  const timerPercent = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 5 ? 'var(--accent)' : '#ef4444';

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="lr">
        <div className="lr__lobby">
          <div className="lr__lobby-icon">⚡</div>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="lr">
        <div className="lr__lobby">
          <div className="lr__lobby-icon">⚠️</div>
          <h2 style={{ color: 'var(--text-primary)' }}>Failed to load questions</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please check your connection and try again.</p>
          <button className="lr__start-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
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
              <span className="lr__stat-value">+{XP_PER_CORRECT * TOTAL_QUESTIONS}</span>
              <span className="lr__stat-label">Max XP</span>
            </div>
          </div>
          <div className="lr__lobby-rules">
            <p>⚡ Answer faster for bonus XP</p>
            <p>🏆 Perfect score earns +{PERFECT_BONUS} bonus XP</p>
            <p>🔀 Random questions from all modules</p>
          </div>
          {!user && (
            <p className="lr__login-warning">
              ⚠️ <button className="lr__link-btn" onClick={() => navigate('/login')}>Log in</button> to save your XP
            </p>
          )}
          <button className="lr__start-btn" onClick={startGame}>
            ⚡ Start Lightning Round
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="lr">
        <div className="lr__countdown">
          <div className="lr__countdown-number">{countdown}</div>
          <p>Get Ready!</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const isPerfect = correctCount === TOTAL_QUESTIONS;
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    return (
      <div className="lr">
        <div className="lr__results">
          <div className="lr__results-trophy">
            {isPerfect ? '🏆' : correctCount >= 7 ? '🌟' : correctCount >= 4 ? '👍' : '📚'}
          </div>
          <h1 className="lr__results-title">{isPerfect ? 'Perfect Score!' : 'Round Complete!'}</h1>
          <div className="lr__results-score">
            <span className="lr__results-fraction">{correctCount} / {TOTAL_QUESTIONS}</span>
            <span className="lr__results-pct">{pct}% correct</span>
          </div>
          {isPerfect && (
            <div className="lr__perfect-badge">⚡ Perfect Bonus: +{PERFECT_BONUS} XP</div>
          )}
          <div className="lr__results-xp">
            +{xpEarned} XP {user ? 'added to your account!' : '(log in to save XP)'}
          </div>
          <div className="lr__results-actions">
            <button className="lr__start-btn" onClick={startGame}>Play Again</button>
            <button className="lr__home-btn" onClick={() => navigate('/')}>Back to Modules</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className={`lr ${flashCorrect ? 'lr--flash-correct' : ''} ${flashWrong ? 'lr--flash-wrong' : ''}`}>
      <div className="lr__game">
        <div className="lr__header">
          <span className="lr__category-badge">{currentQ.category}</span>
          <span className="lr__question-count">{currentIndex + 1} / {TOTAL_QUESTIONS}</span>
          <div className="lr__score-display">⚡ {score} XP</div>
        </div>

        <div className="lr__timer-wrap">
          <div
            className="lr__timer-bar"
            style={{
              width: `${timerPercent}%`,
              background: timerColor,
              transition: 'width 1s linear, background 0.3s',
            }}
          />
        </div>
        <div className="lr__timer-label" style={{ color: timerColor }}>{timeLeft}s</div>

        <div className="lr__question-card">
          <p className="lr__question-text">{currentQ.q.question}</p>
        </div>

        <div className="lr__answers">
          {currentQ.q.options.map((option, i) => {
            let cls = 'lr__answer';
            if (isAnswered) {
              if (currentQ.q.isCorrectAnswer(i)) cls += ' lr__answer--correct';
              else if (i === selectedAnswer) cls += ' lr__answer--wrong';
            } else if (selectedAnswer === i) {
              cls += ' lr__answer--selected';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={isAnswered}>
                <span className="lr__answer-letter">{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}