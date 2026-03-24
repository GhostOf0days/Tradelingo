import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import '../styles/Quizzes.css';
import confetti from 'canvas-confetti';

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  questions: number;
  category: string;
}

export default function Quizzes() {
  const { user, setUser, updateStreak } = useUser();
  const [quizzes] = useState<Quiz[]>([
    {
      id: 1,
      title: 'Stock Basics Challenge',
      description: 'Test your knowledge on stock market fundamentals',
      difficulty: 'Easy',
      xpReward: 100,
      questions: 10,
      category: 'Stocks',
    },
    {
      id: 2,
      title: 'Market Volatility Quiz',
      description: 'Understand price fluctuations and market risk',
      difficulty: 'Medium',
      xpReward: 200,
      questions: 15,
      category: 'Risk',
    },
    {
      id: 3,
      title: 'Portfolio Strategy Exam',
      description: 'Master diversification and asset allocation',
      difficulty: 'Hard',
      xpReward: 300,
      questions: 20,
      category: 'Strategy',
    },
    {
      id: 4,
      title: 'Dividend Investor Quiz',
      description: 'Learn about dividend investing and income strategies',
      difficulty: 'Medium',
      xpReward: 150,
      questions: 12,
      category: 'Income',
    },
    {
      id: 5,
      title: 'ETF Master Class',
      description: 'Become an expert on exchange-traded funds',
      difficulty: 'Medium',
      xpReward: 180,
      questions: 14,
      category: 'ETFs',
    },
    {
      id: 6,
      title: 'Retirement Planning Sprint',
      description: 'Test your retirement account knowledge',
      difficulty: 'Hard',
      xpReward: 250,
      questions: 18,
      category: 'Retirement',
    },
  ]);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: 'What does diversification help reduce?',
      options: ['Taxes', 'Risk', 'Fees', 'Returns'],
      correct: 1,
    },
    {
      question: 'Which is a low-cost investment vehicle?',
      options: ['Hedge Fund', 'ETF', 'Penny Stock', 'Crypto'],
      correct: 1,
    },
    {
      question: 'What is a dividend?',
      options: ['A loss', 'A payment to shareholders', 'A tax', 'A fee'],
      correct: 1,
    },
    {
      question: 'What does Beta measure?',
      options: ['Company growth', 'Volatility', 'Profit', 'Size'],
      correct: 1,
    },
    {
      question: 'Which is the safest investment?',
      options: ['Penny stocks', 'Blue-chip stocks', 'Options', 'Futures'],
      correct: 1,
    },
  ];

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
