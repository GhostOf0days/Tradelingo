// Lists modules you've fully cleared (lesson count ≥ lesson total) and opens lessons in review mode.
// Note: completion metadata is derived from progress here, not the separate completed-modules API.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/ReviewModules.css';
import { MODULES } from '../data/modules';
import { CompletedModule } from '../models/CompletedModule';

const MODULES_LIST = Object.entries(MODULES).map(([id, data]) => ({
  id: Number(id),
  ...data
}));

export default function ReviewModules() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState<CompletedModule[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/progress?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          const progressMap = data.progressByModuleId || {};
          // Infer "completed" from lesson counter vs static lesson length (not /api/completed-modules).
          const finishedModules = MODULES_LIST.filter(m => {
            const currentLesson = progressMap[m.id]?.lessonCurrent || 0;
            return currentLesson >= m.lessons.length && m.lessons.length > 0;
          }).map(m => ({
            moduleId: m.id,
            title: m.title,
            completedDate: new Date().toISOString(),
            xpEarned: m.experiencePoints,
            score: 100,
            lessons: m.lessons.length
          }));

          setCompletedModules(finishedModules);
        }
      } catch (err) {
        console.warn('Failed to fetch completed modules:', err);
      }
    };

    fetchProgress();
  }, [user]);

  /** Opens the module reader with ?review=true so Lesson.tsx skips XP/progress writes. */
  const handleReviewLesson = (moduleId: number) => {
    navigate(`/lesson/${moduleId}?review=true`);
  };

  /** Locale-formatted date for cards (ISO strings from the server or synthetic `new Date()`). */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="review-modules">
      <div className="review-modules__header">
        <h1>Completed Modules</h1>
        <p>Review and refresh your knowledge on modules you've already mastered</p>
      </div>

      {completedModules.length === 0 ? (
        <div className="review-modules__empty">
          <div className="review-modules__empty-icon"></div>
          <h2>No Completed Modules Yet</h2>
          <p>Complete your first module to unlock the ability to review it here</p>
          <button className="review-modules__cta" onClick={() => navigate('/')}>
            Go to Modules
          </button>
        </div>
      ) : (
        <div className="review-modules__grid">
          {completedModules.map((module) => (
            <div key={module.moduleId} className="review-modules__card">
              <div className="review-modules__card-header">
                <h3>{module.title}</h3>
                <span className="review-modules__badge">Completed</span>
              </div>
              
              <div className="review-modules__meta">
                <div className="review-modules__meta-item">
                  <div className="review-modules__label">Completed on</div>
                  <div className="review-modules__value">{formatDate(module.completedDate)}</div>
                </div>
                <div className="review-modules__meta-item" style={{ textAlign: 'right' }}>
                  <div className="review-modules__label">Mastery</div>
                  <div className="review-modules__value">{module.score}%</div>
                </div>
              </div>

              <div className="review-modules__xp-badge">
                +{module.xpEarned} XP Earned
              </div>

              <button
                className="review-modules__btn review-modules__btn--secondary"
                onClick={() => handleReviewLesson(module.moduleId)}
              >
                Review Lessons
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
