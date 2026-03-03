import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { TRADING_LESSONS } from '../data/trading';

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, updateStreak } = useUser();
  
  const [lessonData, setLessonData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'info' | 'quiz' | 'complete'>('info');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lessonNumber, setLessonNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentProgress = async () => {
    // 1. If they aren't logged in, redirect them to login so they don't get stuck!
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/progress/${user.email}`);
      
      if (!res.ok) throw new Error("Failed to reach database");
      
      const data = await res.json();
      
      // Get current lesson index, safely defaulting to 0
      const currentIdx = data.progressByModuleId?.[id || "1"]?.lessonCurrent || 0;
      
      if (currentIdx >= TRADING_LESSONS.length) {
        navigate('/'); // Module already finished
      } else {
        setLessonNumber(currentIdx);
        setLessonData(TRADING_LESSONS[currentIdx]);
        setCurrentStep('info');
        setSelectedAnswer(null);
      }
    } catch (err) {
      console.error("Error loading lesson:", err);
      // Fallback: If the database connection blips, safely load Lesson 1 anyway
      setLessonNumber(0);
      setLessonData(TRADING_LESSONS[0]);
    } finally {
      // ALWAYS turn off the loading screen, no matter what happens
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCurrentProgress(); }, [user, id]);

  const handleNext = async () => {
    if (currentStep === 'info') {
      setCurrentStep('quiz');
    } else if (currentStep === 'quiz') {
      if (selectedAnswer === lessonData.question.correctIndex) {
        if (user) {
          const res = await fetch('http://localhost:3000/api/complete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, moduleId: Number(id), xpToAdd: 50 })
          });
          const data = await res.json();
          setUser({ ...user, experiencePoints: data.experiencePoints });
          updateStreak(); // Update streak when lesson is completed
        }
        setCurrentStep('complete');
      } else {
        alert("Incorrect! Try again.");
      }
    }
  };

  if (isLoading || !lessonData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  const progressPercent = Math.round((lessonNumber / 15) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      
      {/* Header Area with Progress Bar AND Test Out Button */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Module Progress</span>
            <span style={{ fontWeight: 'bold' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '12px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', width: `${progressPercent}%`, 
              background: 'var(--accent)', transition: 'width 0.6s ease' 
            }} />
          </div>
        </div>
        
        {/* NEW: Test Out Button */}
        {currentStep !== 'complete' && (
          <button 
            onClick={() => navigate(`/pretest/${id}`)}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '2px solid #eab308',
              color: '#eab308',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Test Out
          </button>
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
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h2>Excellent Work!</h2>
            <p>You earned +50 XP.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
               <button className="modules__card-btn" onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>Map</button>
               <button className="modules__card-btn" onClick={fetchCurrentProgress}>Next Lesson</button>
            </div>
          </div>
        )}
      </div>

      {currentStep !== 'complete' && (
        <button 
          className="modules__card-btn" 
          style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}
          onClick={handleNext}
          disabled={currentStep === 'quiz' && selectedAnswer === null}
        >
          {currentStep === 'info' ? 'Understood' : 'Submit Answer'}
        </button>
      )}
    </div>
  );
}