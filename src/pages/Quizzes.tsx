import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import '../styles/Quizzes.css';
import { QuizQuestion } from '../models/QuizQuestion';
import { Quiz } from '../models/Quiz';
import confetti from 'canvas-confetti';

const QUIZZES: Quiz[] = [
  new Quiz(1, 'Stock Basics Challenge', 'Test your knowledge on stock market fundamentals', 'Easy', 'Stocks', 100, 10),
  new Quiz(2, 'Market Volatility Quiz', 'Understand price fluctuations and market risk', 'Medium', 'Risk', 200, 15),
  new Quiz(3, 'Portfolio Strategy Exam', 'Master diversification and asset allocation', 'Hard', 'Strategy', 300, 20),
  new Quiz(4, 'Dividend Investor Quiz', 'Learn about dividend investing and income strategies', 'Medium', 'Income', 150, 12),
  new Quiz(5, 'ETF Master Class', 'Become an expert on exchange-traded funds', 'Medium', 'ETFs', 180, 14),
  new Quiz(6, 'Retirement Planning Sprint', 'Test your retirement account knowledge', 'Hard', 'Retirement', 250, 18),
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  new QuizQuestion('What does diversification help reduce?', ['Taxes', 'Risk', 'Fees', 'Returns'], 1, 'Diversification spreads investments across different assets, which reduces overall portfolio risk. It does not directly reduce taxes, fees, or returns.'),
  new QuizQuestion('Which is a low-cost investment vehicle?', ['Hedge Fund', 'ETF', 'Penny Stock', 'Crypto'], 1, 'ETFs (Exchange-Traded Funds) typically have low expense ratios and provide diversified exposure. Hedge funds charge high fees, while penny stocks and crypto carry high risk.'),
  new QuizQuestion('What is a dividend?', ['A loss', 'A payment to shareholders', 'A tax', 'A fee'], 1, 'A dividend is a distribution of a portion of a company\'s earnings to its shareholders, usually paid quarterly.'),
  new QuizQuestion('What does Beta measure?', ['Company growth', 'Volatility', 'Profit', 'Size'], 1, 'Beta measures the volatility of a stock relative to the overall market. A beta greater than 1 indicates higher volatility than the market.'),
  new QuizQuestion('Which is the safest investment?', ['Penny stocks', 'Blue-chip stocks', 'Options', 'Futures'], 1, 'Blue-chip stocks are shares in large, well-established companies with a history of reliable performance, making them the safest option among these choices.'),
];

type MistakeRecord = {
  questionIndex: number;
  userAnswer: number;
};

type QuizAttempt = {
  quizId: number;
  quizTitle: string;
  score: number;
  total: number;
  mistakes: MistakeRecord[];
  timestamp: string;
};

export default function Quizzes() {
  const { user, setUser, updateStreak } = useUser();
  const [quizzes] = useState<Quiz[]>(QUIZZES);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizAttempt[]>([]);
  const [reviewingAttempt, setReviewingAttempt] = useState<QuizAttempt | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [viewMode, setViewMode] = useState<'quizzes' | 'completed'>('quizzes');

  const quizQuestions = QUIZ_QUESTIONS;

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setUserAnswers(new Array(quizQuestions.length).fill(null));
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = async () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(updatedAnswers);

    let newScore = score;
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);

      const mistakes: MistakeRecord[] = [];
      updatedAnswers.forEach((ans, idx) => {
        if (ans !== quizQuestions[idx].correct) {
          mistakes.push({ questionIndex: idx, userAnswer: ans ?? -1 });
        }
      });

      if (selectedQuiz) {
        const attempt: QuizAttempt = {
          quizId: selectedQuiz.id,
          quizTitle: selectedQuiz.title,
          score: newScore,
          total: quizQuestions.length,
          mistakes,
          timestamp: new Date().toISOString(),
        };
        setCompletedQuizzes(prev => [attempt, ...prev]);
      }
      
      const percentage = Math.round((newScore / quizQuestions.length) * 100);
      const passed = percentage >= 80;

      if (passed) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7']
        });

        if (user && selectedQuiz) {
          try {
            const response = await fetch('/api/update-xp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                xpToAdd: selectedQuiz.xpReward,
              }),
            });
            if (response.ok) {
              const data = await response.json();
              setUser({ ...user, experiencePoints: data.experiencePoints });
              updateStreak();
            }
          } catch (err) {
            console.error('Failed to update XP', err);
          }
        }
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (quizStarted && selectedQuiz && !showResults) {
    const question = quizQuestions[currentQuestion];
    const progress = Math.round(((currentQuestion + 1) / quizQuestions.length) * 100);

    return (
      <div className="quizzes__quiz-container">
        <div className="quizzes__quiz-header">
          <h2>{selectedQuiz.title}</h2>
          <div className="quizzes__progress">
            <span>{currentQuestion + 1} of 5</span>
            <div className="quizzes__progress-bar">
              <div
                className="quizzes__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="quizzes__quiz-content">
          <h3>{question.question}</h3>
          <div className="quizzes__options">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`quizzes__option ${selectedAnswer === idx ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(idx)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="quizzes__next-btn"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults && selectedQuiz) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 80;
    const xpEarned = passed ? selectedQuiz.xpReward : 0;

    return (
      <div className="quizzes__results">
        <div className="quizzes__results-card">
          <div className="quizzes__results-icon">
            {passed ? '🎉' : '📚'}
          </div>
          <h2>{selectedQuiz.title}</h2>
          <div className="quizzes__score">
            <p className="quizzes__score-text">Your Score</p>
            <p className="quizzes__score-value">
              {score} / {quizQuestions.length}
            </p>
            <p className="quizzes__score-percentage">{percentage}%</p>
          </div>
          {passed ? (
            <div className="quizzes__reward">
              <p>🏆 XP Earned</p>
              <p className="quizzes__xp-value">+{xpEarned} XP</p>
            </div>
          ) : (
            <div className="quizzes__reward" style={{ background: 'var(--surface-hover)', color: 'var(--text-primary)' }}>
              <p>You need 80% to earn XP. Review the modules and try again!</p>
              <p className="quizzes__xp-value" style={{ fontSize: '1.2rem' }}>0 XP</p>
            </div>
          )}
          <div className="quizzes__actions">
            <button className="quizzes__btn quizzes__btn--secondary" onClick={handleRetry}>
              Try Again
            </button>
            {completedQuizzes.length > 0 && completedQuizzes[0].mistakes.length > 0 && (
              <button
                className="quizzes__btn quizzes__btn--secondary"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                onClick={() => {
                  setReviewingAttempt(completedQuizzes[0]);
                  setReviewIndex(0);
                  setShowExplanation(false);
                  setShowResults(false);
                  setQuizStarted(false);
                }}
              >
                Review Mistakes
              </button>
            )}
            <button
              className="quizzes__btn quizzes__btn--primary"
              onClick={() => {
                setQuizStarted(false);
                setSelectedQuiz(null);
                setShowResults(false);
              }}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reviewingAttempt) {
    const mistake = reviewingAttempt.mistakes[reviewIndex];
    const q = quizQuestions[mistake.questionIndex];
    const isLastMistake = reviewIndex >= reviewingAttempt.mistakes.length - 1;

    return (
      <div className="quizzes__quiz-container">
        <div className="quizzes__quiz-header">
          <h2>Review Mistakes — {reviewingAttempt.quizTitle}</h2>
          <div className="quizzes__progress">
            <span>Mistake {reviewIndex + 1} of {reviewingAttempt.mistakes.length}</span>
            <div className="quizzes__progress-bar">
              <div
                className="quizzes__progress-fill"
                style={{ width: `${((reviewIndex + 1) / reviewingAttempt.mistakes.length) * 100}%`, background: '#ef4444' }}
              />
            </div>
          </div>
        </div>

        <div className="quizzes__quiz-content">
          <h3>{q.question}</h3>
          <div className="quizzes__options">
            {q.options.map((option, idx) => {
              let style: React.CSSProperties = {};
              if (idx === q.correct) {
                style = { borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
              } else if (idx === mistake.userAnswer) {
                style = { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', textDecoration: 'line-through' };
              }
              return (
                <div key={idx} className="quizzes__option" style={{ ...style, cursor: 'default' }}>
                  {idx === q.correct && '✅ '}{idx === mistake.userAnswer && idx !== q.correct && '❌ '}{option}
                </div>
              );
            })}
          </div>

          {!showExplanation ? (
            <button
              className="quizzes__next-btn"
              style={{ background: '#6366f1' }}
              onClick={() => setShowExplanation(true)}
            >
              Show Explanation
            </button>
          ) : (
            <>
              <div style={{ background: 'var(--surface-hover)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                <strong style={{ color: '#6366f1' }}>Explanation:</strong> {q.explanation || 'The correct answer is: ' + q.getCorrectAnswer()}
              </div>
              <button
                className="quizzes__next-btn"
                onClick={() => {
                  if (isLastMistake) {
                    setReviewingAttempt(null);
                    setReviewIndex(0);
                    setShowExplanation(false);
                  } else {
                    setReviewIndex(reviewIndex + 1);
                    setShowExplanation(false);
                  }
                }}
              >
                {isLastMistake ? 'Done Reviewing' : 'Next Mistake'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'completed') {
    return (
      <div className="quizzes">
        <div className="quizzes__hero">
          <h1>📋 Completed Quizzes</h1>
          <p>Review your past quiz attempts and learn from mistakes</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button className="quizzes__btn quizzes__btn--secondary" onClick={() => setViewMode('quizzes')}>
            ← Back to Quizzes
          </button>
        </div>
        {completedQuizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p>No completed quizzes yet. Take a quiz to see your results here!</p>
          </div>
        ) : (
          <div className="quizzes__grid">
            {completedQuizzes.map((attempt, idx) => {
              const pct = Math.round((attempt.score / attempt.total) * 100);
              const passed = pct >= 80;
              return (
                <div key={idx} className="quizzes__card">
                  <div className="quizzes__difficulty" style={{ backgroundColor: passed ? '#22c55e' : '#ef4444' }}>
                    {passed ? 'Passed' : 'Failed'}
                  </div>
                  <h3>{attempt.quizTitle}</h3>
                  <p>Score: {attempt.score}/{attempt.total} ({pct}%)</p>
                  <div className="quizzes__meta">
                    <span>❌ {attempt.mistakes.length} mistake{attempt.mistakes.length !== 1 ? 's' : ''}</span>
                    <span>{new Date(attempt.timestamp).toLocaleDateString()}</span>
                  </div>
                  {attempt.mistakes.length > 0 && (
                    <button
                      className="quizzes__start-btn"
                      style={{ background: '#6366f1' }}
                      onClick={() => {
                        setReviewingAttempt(attempt);
                        setReviewIndex(0);
                        setShowExplanation(false);
                        setViewMode('quizzes');
                      }}
                    >
                      Review Mistakes
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quizzes">
      <div className="quizzes__hero">
        <h1>🧠 Knowledge Checks</h1>
        <p>Test your skills and earn XP with our quiz challenges</p>
      </div>

      <div className="quizzes__stats">
        <div className="quizzes__stat">
          <span className="quizzes__stat-label">Total Quizzes</span>
          <span className="quizzes__stat-value">{quizzes.length}</span>
        </div>
        <div className="quizzes__stat">
          <span className="quizzes__stat-label">XP Available</span>
          <span className="quizzes__stat-value">
            {quizzes.reduce((sum, q) => sum + q.xpReward, 0)}
          </span>
        </div>
        <div className="quizzes__stat" style={{ cursor: 'pointer' }} onClick={() => setViewMode('completed')}>
          <span className="quizzes__stat-label">Completed</span>
          <span className="quizzes__stat-value">{completedQuizzes.length}</span>
        </div>
      </div>

      <div className="quizzes__grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quizzes__card">
            <div
              className="quizzes__difficulty"
              style={{ backgroundColor: difficultyColor(quiz.difficulty) }}
            >
              {quiz.difficulty}
            </div>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <div className="quizzes__meta">
              <span>📝 {quiz.questions} questions</span>
              <span>⭐ {quiz.xpReward} XP</span>
            </div>
            <button className="quizzes__start-btn" onClick={() => handleStartQuiz(quiz)}>
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}