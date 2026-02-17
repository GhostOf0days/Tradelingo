import { useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import './ModulesPage.css';

const MODULES = [
  { id: 1, title: 'Trading', lessonTotal: 15, experiencePoints: 600 },
  { id: 2, title: 'Retirement', lessonTotal: 12, experiencePoints: 800 },
  { id: 3, title: 'Cryptocurrencies', lessonTotal: 21, experiencePoints: 700 },
  { id: 4, title: 'Brokers', lessonTotal: 10, experiencePoints: 600 },
];

/** for initial user only the first module is unlocked. later this can come from db/auth */
const INITIAL_LAST_UNLOCKED_MODULE_ID = 1;

/** progress is tied to account; for a new account everything starts at 0. later load from db */
const INITIAL_PROGRESS: Record<number, { lessonCurrent: number; streakBonus: number }> = {};

function ModulesPage() {
  const [filter, setFilter] = useState<'in-progress' | 'completed'>('in-progress');
  const lastUnlockedModuleId = INITIAL_LAST_UNLOCKED_MODULE_ID;
  const progressByModuleId = INITIAL_PROGRESS;

  const filteredModules = MODULES.filter((module, index) => {
    const moduleNumber = index + 1;
    const isUnlocked = moduleNumber <= lastUnlockedModuleId;
    const progress = progressByModuleId[module.id] ?? { lessonCurrent: 0, streakBonus: 0 };
    const lessonCurrent = isUnlocked ? progress.lessonCurrent : 0;
    const isCompleted = lessonCurrent >= module.lessonTotal && module.lessonTotal > 0;
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
      <ul className="modules__timeline">
        {filteredModules.map((module) => {
          const moduleNumber = MODULES.findIndex((m) => m.id === module.id) + 1;
          const isUnlocked = moduleNumber <= lastUnlockedModuleId;
          const progress = progressByModuleId[module.id] ?? { lessonCurrent: 0, streakBonus: 0 };
          const lessonCurrent = isUnlocked ? progress.lessonCurrent : 0;
          const progressPercent =
            module.lessonTotal > 0 ? Math.round((lessonCurrent / module.lessonTotal) * 100) : 0;
          const showProgressAndButton = isUnlocked;
          const isCompleted = lessonCurrent >= module.lessonTotal && module.lessonTotal > 0;
          const actionLabel =
            lessonCurrent === 0 ? 'Start Lesson' : isCompleted ? null : 'Continue';

          return (
            <li key={module.id} className="modules__item">
              <div
                className={`modules__node ${showProgressAndButton ? (isCompleted ? 'modules__node--completed' : '') : 'modules__node--locked'}`}
              >
                {isCompleted ? <CheckCircle2 size={20} strokeWidth={3} /> : moduleNumber}
              </div>
              <article
                className={`modules__card ${showProgressAndButton ? '' : 'modules__card--locked'}`}
              >
                <div className="modules__card-inner">
                  <div className="modules__card-head">
                    <div className="modules__card-title-row">
                      <h2 className="modules__card-title">{module.title}</h2>
                      <span className={`modules__card-xp ${showProgressAndButton ? '' : 'modules__card-xp--locked'}`}>
                        <span className="modules__xp-icon" aria-hidden="true" />
                        +{module.experiencePoints} XP
                      </span>
                    </div>
                    <p className="modules__card-lessons">
                      Lesson {lessonCurrent} of {module.lessonTotal}
                    </p>
                  </div>
                  {showProgressAndButton && (
                    <>
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
                          <div className="modules__streak-badge">+{progress.streakBonus}</div>
                        </div>
                        {actionLabel !== null && (
                          <button type="button" className="modules__card-btn">
                            {actionLabel}
                            <Play size={12} fill="currentColor" className="modules__card-btn-icon" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
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
          <button type="button" className="modules__lightning-play" aria-label="Play Lightning Round">
            <Play size={20} fill="currentColor" className="modules__lightning-play-icon" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default ModulesPage;
