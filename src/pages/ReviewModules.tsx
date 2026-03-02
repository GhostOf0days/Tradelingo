import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import '../styles/ReviewModules.css';

interface CompletedModule {
  moduleId: number;
  title: string;
  description: string;
  completedDate: string;
  xpEarned: number;
  score: number;
  lessons: number;
}

export default function ReviewModules() {
  const { user } = useUser();
  const [completedModules, setCompletedModules] = useState<CompletedModule[]>([
    {
      moduleId: 1,
      title: 'Stock Market Fundamentals',
      description: 'Learn the basics of stocks, exchanges, and market dynamics',
      completedDate: '2026-02-28',
      xpEarned: 500,
      score: 94,
      lessons: 15,
    },
    {
      moduleId: 2,
      title: 'Retirement Planning',
      description: 'Master the essentials of planning for your financial future',
      completedDate: '2026-02-25',
      xpEarned: 600,
      score: 88,
      lessons: 12,
    },
  ]);

  const [selectedModule, setSelectedModule] = useState<CompletedModule | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Fetch completed modules from backend
    const fetchCompletedModules = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:3000/api/completed-modules/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setCompletedModules(data);
        }
      } catch (err) {
        console.error('Failed to fetch completed modules:', err);
      }
    };

    fetchCompletedModules();
  }, [user]);

  const handleSelectModule = (module: CompletedModule) => {
    setSelectedModule(module);
    setShowDetails(true);
  };

  const handleReviewLesson = (moduleId: number) => {
    window.location.href = `/lesson/${moduleId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="review-modules">
      <div className="review-modules__header">
        <h1>📚 Completed Modules</h1>
        <p>Review and refresh your knowledge on modules you've already mastered</p>
      </div>

      {completedModules.length === 0 ? (
        <div className="review-modules__empty">
          <div className="review-modules__empty-icon">📖</div>
          <h2>No Completed Modules Yet</h2>
          <p>Complete your first module to unlock the ability to review it here</p>
          <button className="review-modules__cta" onClick={() => (window.location.href = '/')}>
            Go to Modules →
          </button>
        </div>
      ) : (
        <>
          <div className="review-modules__stats">
            <div className="review-modules__stat">
              <span className="review-modules__stat-label">Modules Completed</span>
              <span className="review-modules__stat-value">{completedModules.length}</span>
            </div>
            <div className="review-modules__stat">
              <span className="review-modules__stat-label">Total XP Earned</span>
              <span className="review-modules__stat-value">
                {completedModules.reduce((sum, m) => sum + m.xpEarned, 0)}
              </span>
            </div>
            <div className="review-modules__stat">
              <span className="review-modules__stat-label">Average Score</span>
              <span className="review-modules__stat-value">
                {Math.round(completedModules.reduce((sum, m) => sum + m.score, 0) / completedModules.length)}%
              </span>
            </div>
          </div>

          <div className="review-modules__grid">
            {completedModules.map((module) => (
              <div key={module.moduleId} className="review-modules__card">
                <div className="review-modules__card-header">
                  <h3>{module.title}</h3>
                  <span className="review-modules__badge">✅ Completed</span>
                </div>

                <p className="review-modules__description">{module.description}</p>

                <div className="review-modules__meta">
                  <div className="review-modules__meta-item">
                    <span className="review-modules__label">Completed on</span>
                    <span className="review-modules__value">{formatDate(module.completedDate)}</span>
                  </div>
                  <div className="review-modules__meta-item">
                    <span className="review-modules__label">Score</span>
                    <span className="review-modules__value">{module.score}%</span>
                  </div>
                </div>

                <div className="review-modules__progress">
                  <div className="review-modules__progress-label">
                    <span>Mastery Level</span>
                    <span className="review-modules__progress-percent">{module.score}%</span>
                  </div>
                  <div className="review-modules__progress-bar">
                    <div
                      className="review-modules__progress-fill"
                      style={{ width: `${module.score}%` }}
                    />
                  </div>
                </div>

                <div className="review-modules__xp-badge">
                  ⭐ +{module.xpEarned} XP
                </div>

                <div className="review-modules__actions">
                  <button
                    className="review-modules__btn review-modules__btn--secondary"
                    onClick={() => handleSelectModule(module)}
                  >
                    View Details
                  </button>
                  <button
                    className="review-modules__btn review-modules__btn--primary"
                    onClick={() => handleReviewLesson(module.moduleId)}
                  >
                    Review Lessons →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for module details */}
          {showDetails && selectedModule && (
            <div className="review-modules__modal-overlay" onClick={() => setShowDetails(false)}>
              <div className="review-modules__modal" onClick={(e) => e.stopPropagation()}>
                <button className="review-modules__modal-close" onClick={() => setShowDetails(false)}>
                  ✕
                </button>
                <h2>{selectedModule.title}</h2>
                <p className="review-modules__modal-description">{selectedModule.description}</p>

                <div className="review-modules__modal-stats">
                  <div className="review-modules__modal-stat">
                    <span className="review-modules__modal-stat-label">Lessons</span>
                    <span className="review-modules__modal-stat-value">{selectedModule.lessons}</span>
                  </div>
                  <div className="review-modules__modal-stat">
                    <span className="review-modules__modal-stat-label">Score</span>
                    <span className="review-modules__modal-stat-value">{selectedModule.score}%</span>
                  </div>
                  <div className="review-modules__modal-stat">
                    <span className="review-modules__modal-stat-label">XP Earned</span>
                    <span className="review-modules__modal-stat-value">+{selectedModule.xpEarned}</span>
                  </div>
                </div>

                <button
                  className="review-modules__btn review-modules__btn--primary"
                  onClick={() => {
                    setShowDetails(false);
                    handleReviewLesson(selectedModule.moduleId);
                  }}
                >
                  Start Review Session →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
