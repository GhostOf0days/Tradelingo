import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MODULES } from '../data/modules';

export default function Pretest() {
  const { id } = useParams();
  const moduleId = Number(id) || 1;
  const module = MODULES[moduleId as keyof typeof MODULES] || MODULES[1];
  const pretest = module.pretest;
  const navigate = useNavigate();
  const { user, setUser, updateStreak } = useUser();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const currentQuestion = pretest[currentIndex];
  const progressPercent = Math.round((currentIndex / pretest.length) * 100);

  const handleNext = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < pretest.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setSelectedAnswer(null);
    } else {
      // Pretest finished and Check if they passed >= 80%
      if (newScore / pretest.length >= 0.8 && user) {
        try {
          const response = await fetch('/api/pass-module', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email, 
              moduleId: Number(id),
              xpToAdd: 500, // XP bonus
              totalLessons: module.lessons.length,
            })
          });
          if (response.ok) {
            const data = await response.json();
            setUser({ ...user, experiencePoints: data.experiencePoints });
            updateStreak();
          }
        } catch (err) {
          console.warn("Failed to save pre-test", err);
        }
      }
      setIsComplete(true);
    }
  };

  const handleSkipModule = async () => {
    if (user) {
      try {
        const response = await fetch('/api/update-xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.email, 
            xpToAdd: 25 
          })
        });
        if (response.ok) {
          const data = await response.json();
          setUser({ ...user, experiencePoints: data.experiencePoints });
          updateStreak();
        }
      } catch (err) {
        console.warn("Failed to update XP", err);
      }
    }
    navigate(`/lesson/${id}`);
  };

  if (isComplete) {
    const passed = score / pretest.length >= 0.8;
    return (
      <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div className="modules__card" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🏆' : '📚'}</div>
          <h2>{passed ? 'You Tested Out!' : 'Keep Learning!'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            You scored {score} out of {pretest.length}.
            {passed ? " The next module is now unlocked and you earned +500 XP!" : " You need 80% correct to test out. Head back to take the regular lessons."}
          </p>
          <button className="modules__card-btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Pre-Test Progress</span>
          <span style={{ fontWeight: '600' }}>{progressPercent}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: '#eab308', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div className="modules__card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#eab308' }}>Module {id} Pre-Test</h2>
          <button 
            onClick={() => setShowSkipDialog(true)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Skip
          </button>
        </div>

        <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>{currentQuestion.question}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(idx)}
              style={{
                padding: '1.25rem', textAlign: 'left',
                background: selectedAnswer === idx ? 'var(--surface-hover)' : 'transparent',
                border: selectedAnswer === idx ? '2px solid #eab308' : '2px solid var(--border)',
                borderRadius: '0.75rem', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="modules__card-btn" 
        style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', background: '#eab308', color: '#000' }}
        onClick={handleNext}
        disabled={selectedAnswer === null}
      >
        {currentIndex === pretest.length - 1 ? 'Submit Exam' : 'Next Question'}
      </button>

      {/* Skip Dialog Modal */}
      {showSkipDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modules__card" style={{ padding: '2rem', maxWidth: '400px', margin: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>Skip Pre-Test?</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              You can skip the pre-test and go straight to the lessons. You'll earn +25 XP for trying, but you won't unlock the next module until you complete all lessons or pass the post-test.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setShowSkipDialog(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSkipModule}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--accent)',
                  border: 'none',
                  color: 'black',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Skip & Learn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}