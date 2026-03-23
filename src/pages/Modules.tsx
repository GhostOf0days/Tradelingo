import { useState, useEffect } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MODULES } from '../data/modules';
import '../styles/Modules.css';

const MODULE_LIST = Object.entries(MODULES).map(([id, data]) => ({
  id: Number(id),
  ...data
}));

// Class to encapsulate progress management
class ProgressManager {
  static async fetchProgress(email: string) {
    const response = await fetch(`/api/progress/${email}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Failed to fetch progress");
  }
}

export default function Modules() {
  const [filter, setFilter] = useState<'in-progress' | 'completed'>('in-progress');
  const [progressByModuleId, setProgressByModuleId] = useState<Record<number, { lessonCurrent?: number }>>({});
  
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setProgressByModuleId({});
        return;
      }

      try {
        const data = await ProgressManager.fetchProgress(user.email);
        setProgressByModuleId(data.progressByModuleId || {});
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };

    fetchProgress();  
  }, [user]);

  const filteredModules = MODULE_LIST.filter((module) => {
    const progress = progressByModuleId[module.id] ?? { lessonCurrent: 0 };
    const lessonCurrent = progress.lessonCurrent ?? 0;
    const isCompleted = lessonCurrent >= module.lessons.length && module.lessons.length > 0;
    
    if (filter === 'completed') return isCompleted;
    return !isCompleted;
  });

  return (
    <div className="modules">
      <div className="modules__head">
        <div>
          <h1 className="modules__title">Modules</h1>
          <p className="modules__subtitle">Track your progress and master new skills.</p>
        </div>
        <div className="modules__toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'in-progress'}
            className={`modules__toggle-btn ${filter === 'in-progress' ? 'modules__toggle-btn--active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'completed'}
            className={`modules__toggle-btn ${filter === 'completed' ? 'modules__toggle-btn--active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredModules.length === 0 ? (
        <p className="modules__empty">
          {filter === 'completed' ? 'No completed modules yet.' : 'No modules in progress.'}
        </p>
      ) : (
      <div className="modules__grid-layout">
        {filteredModules.map((module) => {
          const progress = progressByModuleId[module.id] ?? { lessonCurrent: 0, streakBonus: 0 };
          const lessonCurrent = progress.lessonCurrent ?? 0;
          const progressPercent = module.lessons.length > 0 ? Math.round((lessonCurrent / module.lessons.length) * 100) : 0;
          const isCompleted = lessonCurrent >= module.lessons.length && module.lessons.length > 0;
          const actionLabel = lessonCurrent === 0 ? 'Start Lesson' : isCompleted ? 'Review' : 'Continue';

          return (
            <article key={module.id} className="modules__card">
              <div className="modules__card-inner">
                <div className="modules__card-head">
                  <div className="modules__card-title-row">
                    <h2 className="modules__card-title">
                      {isCompleted && <CheckCircle2 size={18} style={{ marginRight: '8px', color: '#22c55e', verticalAlign: 'middle' }} />}
                      {module.title}
                    </h2>
                    <span className="modules__card-xp">
                      <span className="modules__xp-icon" aria-hidden="true" />
                      +{module.experiencePoints} XP
                    </span>
                  </div>
                  <p className="modules__card-lessons">
                    Lesson {lessonCurrent} of {module.lessons.length}
                  </p>
                </div>
                
                <div className="modules__progress-block">
                  <div className="modules__progress-header">
                    <span className="modules__progress-label-text">Progress</span>
                    <span className="modules__progress-percent">{progressPercent}%</span>
                  </div>
                  <div
                    className="modules__progress-bar"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="modules__progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="modules__card-footer">
                  <div className="modules__streak-row">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="modules__streak-dot" />
                    ))}
                    <div className="modules__streak-badge">+{(progress as { streakBonus?: number }).streakBonus ?? 0}</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lessonCurrent === 0 && (
                      <button 
                        type="button" 
                        className="modules__card-btn"
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                        onClick={() => navigate(`/pretest/${module.id}`)}
                      >
                        Test Out
                      </button>
                    )}
                    
                    <button 
                      type="button" 
                      className="modules__card-btn"
                      onClick={() => navigate(`/lesson/${module.id}${isCompleted ? '?review=true' : ''}`)}
                    >
                      {actionLabel}
                      <Play size={12} fill="currentColor" className="modules__card-btn-icon" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      )}

      <section className="modules__lightning-wrap">
        <div className="modules__lightning">
          <div className="modules__lightning-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="modules__lightning-text">
            <h3 className="modules__lightning-title">Lightning Round</h3>
            <p className="modules__lightning-subtitle">Play daily. Win up to 2,500 XP</p>
          </div>
          <button 
            type="button" 
            className="modules__lightning-play" 
            aria-label="Play Lightning Round"
            onClick={() => navigate('/lightning-round')}
          >
            <Play size={20} fill="currentColor" className="modules__lightning-play-icon" />
          </button>
        </div>
      </section>

      <section className="modules__review-wrap">
        <div className="modules__review">
          <div className="modules__review-icon" aria-hidden="true">📚</div>
          <div className="modules__review-text">
            <h3 className="modules__review-title">Review Completed Modules</h3>
            <p className="modules__review-subtitle">Refresh your knowledge on mastered topics</p>
          </div>
          <button 
            type="button" 
            className="modules__review-btn" 
            aria-label="Review completed modules"
            onClick={() => navigate('/completed-modules')}
          >
            <Play size={20} fill="currentColor" className="modules__review-btn-icon" />
          </button>
        </div>
      </section>
    </div>
  );
}
