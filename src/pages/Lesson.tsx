import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MODULES } from '../data/modules';

export interface LessonItem {
  title: string;
  content: string;
  question: { question: string; options: string[]; correctIndex: number };
}

// Class to encapsulate lesson logic
class LessonManager {
  static async fetchProgress(email: string) {
    const res = await fetch(`/api/progress/${email}`);
    if (!res.ok) throw new Error("Failed to reach database");
    return await res.json();
  }

  static async completeLesson(email: string, moduleId: number, xpToAdd: number) {
    const res = await fetch('/api/complete-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, moduleId, xpToAdd })
    });
    return await res.json();
  }

  static async completeModule(email: string, moduleId: number, title: string, lessonsTotal: number) {
    await fetch('/api/complete-module', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        moduleId,
        title,
        score: 100,
        xpEarned: 500,
        lessonsTotal
      })
    });
  }
}

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, updateStreak } = useUser();
  
  const queryParams = new URLSearchParams(location.search);
  const isReviewMode = queryParams.get('review') === 'true';
  
  const moduleId = Number(id) || 1;
  const moduleInfo = MODULES[moduleId as keyof typeof MODULES] || MODULES[1];
  const moduleLessons = moduleInfo.lessons;
  
  const [lessonData, setLessonData] = useState<LessonItem | null>(null);
  const [currentStep, setCurrentStep] = useState<'info' | 'quiz' | 'complete'>('info');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lessonNumber, setLessonNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadLocalLesson = (index: number) => {
    if (index >= moduleLessons.length) {
      navigate('/review'); 
      return;
    }
    setLessonNumber(index);
    setLessonData(moduleLessons[index]);
    setCurrentStep('info');
    setSelectedAnswer(null);
  };

  const fetchCurrentProgress = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isReviewMode) {
        loadLocalLesson(0);
      } else {
        const data = await LessonManager.fetchProgress(user.email);
        const currentIdx = data.progressByModuleId?.[moduleId]?.lessonCurrent || 0;
        
        if (currentIdx >= moduleLessons.length) {
          navigate('/'); 
        } else {
          loadLocalLesson(currentIdx);
        }
      }
    } catch (err) {
      console.error("Error loading lesson:", err);
      loadLocalLesson(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCurrentProgress(); }, [user, id]);

  const handleNext = async () => {
    if (currentStep === 'info') {
      setCurrentStep('quiz');
    } else if (currentStep === 'quiz' && lessonData) {
      if (selectedAnswer === lessonData.question.correctIndex) {
        
        if (user && !isReviewMode) {
          try {
            const data = await LessonManager.completeLesson(user.email, moduleId, 50);
            setUser({ ...user, experiencePoints: data.experiencePoints });
            updateStreak(); 
          } catch (err) {
            console.error("Error completing lesson:", err);
          }
        }
        
        if (lessonNumber === moduleLessons.length - 1) {
          if (user && !isReviewMode) {
            try {
              await LessonManager.completeModule(user.email, moduleId, moduleInfo.title, moduleLessons.length);
            } catch (err) {
              console.error("Error completing module:", err);
            }
          }
        }
        
        setCurrentStep('complete');
      } else {
        alert("Incorrect! Try again.");
      }
    }
  };

  const handleNextLesson = () => {
    if (isReviewMode) {
      loadLocalLesson(lessonNumber + 1);
    } else {
      fetchCurrentProgress();
    }
  };

  if (isLoading || !lessonData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  const progressPercent = Math.round(((lessonNumber + 1) / moduleLessons.length) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {isReviewMode ? 'Review Progress' : 'Module Progress'}
            </span>
            <span style={{ fontWeight: 'bold' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '12px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: isReviewMode ? '#22c55e' : 'var(--accent)', transition: 'width 0.6s ease' }} />
          </div>
        </div>
        
        {!isReviewMode && currentStep !== 'complete' && (
          <button onClick={() => navigate(`/pretest/${id}`)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '2px solid #eab308', color: '#eab308', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Test Out</button>
        )}
      </div>

      <div className="modules__card" style={{ padding: '2.5rem' }}>
        {currentStep === 'info' && (
          <>
            <h2 style={{ marginTop: 0 }}>{lessonData.title}</h2>
            <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>{lessonData.content}</p>
          </>
        )}

        {currentStep === 'quiz' && (
          <>
            <h2 style={{ marginTop: 0 }}>Knowledge Check</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{lessonData.question.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lessonData.question.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  style={{
                    padding: '1.25rem', textAlign: 'left', borderRadius: '0.75rem', cursor: 'pointer',
                    background: selectedAnswer === idx ? 'var(--surface-hover)' : 'transparent',
                    border: selectedAnswer === idx ? '2px solid var(--accent)' : '2px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >{opt}</button>
              ))}
            </div>
          </>
        )}

        {currentStep === 'complete' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>{isReviewMode ? '🔁' : '🎉'}</div>
            <h2>{isReviewMode ? 'Review Complete!' : 'Excellent Work!'}</h2>
            <p>{isReviewMode ? 'Great job refreshing your memory.' : 'You earned +50 XP.'}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
               <button className="modules__card-btn" onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>{isReviewMode ? 'Exit Review' : 'Map'}</button>
               <button className="modules__card-btn" onClick={handleNextLesson}>Next Lesson</button>
            </div>
          </div>
        )}
      </div>

      {currentStep !== 'complete' && (
        <button 
          className="modules__card-btn" 
          style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', background: isReviewMode ? '#22c55e' : '' }}
          onClick={handleNext}
          disabled={currentStep === 'quiz' && selectedAnswer === null}
        >
          {currentStep === 'info' ? 'Understood' : 'Submit Answer'}
        </button>
      )}
    </div>
  );
}
