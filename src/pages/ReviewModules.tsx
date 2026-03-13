import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/ReviewModules.css';

// same shape as ModulesPage for progress lookup
const MODULES = [
  { id: 1, title: 'Trading', lessonTotal: 15, experiencePoints: 600, description: "Master the fundamentals of the stock market." },
  { id: 2, title: 'Retirement', lessonTotal: 12, experiencePoints: 800, description: "Learn about 401ks, IRAs, and long-term growth." },
  { id: 3, title: 'Cryptocurrencies', lessonTotal: 21, experiencePoints: 700, description: "Understand blockchain, Bitcoin, and digital assets." },
  { id: 4, title: 'Brokers', lessonTotal: 10, experiencePoints: 600, description: "Navigate trading platforms and execution." },
];

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
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState<CompletedModule[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/progress/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          const progressMap = data.progressByModuleId || {};
          const finishedModules = MODULES.filter(m => {
            const currentLesson = progressMap[m.id]?.lessonCurrent || 0;
            return currentLesson >= m.lessonTotal && m.lessonTotal > 0;
          }).map(m => ({
            moduleId: m.id,
            title: m.title,
            description: m.description,
            completedDate: new Date().toISOString(),
            xpEarned: m.experiencePoints,
            score: 100,
            lessons: m.lessonTotal
          }));

          setCompletedModules(finishedModules);
        }
      } catch (err) {
        console.error('Failed to fetch completed modules:', err);
      }
    };

    fetchProgress();
  }, [user]);

  const handleReviewLesson = (moduleId: number) => {
    navigate(`/lesson/${moduleId}?review=true`); // review mode, no progress write
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="review-modules" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      <div className="review-modules__header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚 Completed Modules</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and refresh your knowledge on modules you've already mastered</p>
      </div>

      {completedModules.length === 0 ? (
        <div className="review-modules__empty" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
          <h2>No Completed Modules Yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Complete your first module to unlock the ability to review it here</p>
          <button 
            style={{ padding: '1rem 2rem', background: 'var(--accent)', color: 'black', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', border: 'none' }} 
            onClick={() => navigate('/')}
          >
            Go to Modules →
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {completedModules.map((module) => (
              <div key={module.moduleId} style={{ background: '#111', padding: '2rem', borderRadius: '1rem', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{module.title}</h3>
                  <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 'bold' }}>✅ Completed</span>
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>{module.description}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Completed on</div>
                    <div style={{ fontWeight: 'bold' }}>{formatDate(module.completedDate)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Mastery</div>
                    <div style={{ fontWeight: 'bold', color: '#22c55e' }}>{module.score}%</div>
                  </div>
                </div>

                <div style={{ background: '#222', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1.5rem', color: '#eab308', fontWeight: 'bold' }}>
                  ⭐ +{module.xpEarned} XP Earned
                </div>

                <button
                  style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid #444', color: 'white', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                  onClick={() => handleReviewLesson(module.moduleId)}
                  onMouseOver={(e) => e.currentTarget.style.background = '#222'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Review Lessons →
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}