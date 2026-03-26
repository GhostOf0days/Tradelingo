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
  new QuizQuestion('What does diversification help reduce?', ['Taxes', 'Risk', 'Fees', 'Returns'], 1),
  new QuizQuestion('Which is a low-cost investment vehicle?', ['Hedge Fund', 'ETF', 'Penny Stock', 'Crypto'], 1),
  new QuizQuestion('What is a dividend?', ['A loss', 'A payment to shareholders', 'A tax', 'A fee'], 1),
  new QuizQuestion('What does Beta measure?', ['Company growth', 'Volatility', 'Profit', 'Size'], 1),
  new QuizQuestion('Which is the safest investment?', ['Penny stocks', 'Blue-chip stocks', 'Options', 'Futures'], 1),
];

export default function Quizzes() {
  const { user, setUser, updateStreak } = useUser();
  const [quizzes] = useState<Quiz[]>(QUIZZES);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const quizQuestions = QUIZ_QUESTIONS;

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = async () => {
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
      
      const percentage = Math.round((newScore / quizQuestions.length) * 100);
      if (percentage >= 60) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (user && selectedQuiz) {
        try {
          const xpToAdd = Math.floor((newScore / quizQuestions.length) * selectedQuiz.xpReward);
          const response = await fetch('/api/update-xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              xpToAdd: xpToAdd,
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
    const xpEarned = Math.floor((score / quizQuestions.length) * selectedQuiz.xpReward);

    return (
      <div className="quizzes__results">
        <div className="quizzes__results-card">
          <div className="quizzes__results-icon">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2>{selectedQuiz.title}</h2>
          <div className="quizzes__score">
            <p className="quizzes__score-text">Your Score</p>
            <p className="quizzes__score-value">
              {score} / {quizQuestions.length}
            </p>
            <p className="quizzes__score-percentage">{percentage}%</p>
          </div>
          <div className="quizzes__reward">
            <p>🏆 XP Earned</p>
            <p className="quizzes__xp-value">+{xpEarned} XP</p>
          </div>
          <div className="quizzes__actions">
            <button className="quizzes__btn quizzes__btn--secondary" onClick={handleRetry}>
              Try Again
            </button>
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