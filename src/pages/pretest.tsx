import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MODULE_1_PRETEST } from '../data/module1';

export default function Pretest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = MODULE_1_PRETEST[currentIndex];
  const progressPercent = Math.round((currentIndex / MODULE_1_PRETEST.length) * 100);

  const handleNext = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < MODULE_1_PRETEST.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setSelectedAnswer(null);
    } else {
      // PRETEST FINISHED! Check if they passed (12 out of 15)
      if (newScore >= 12 && user) {
        try {
          const response = await fetch('http://localhost:3000/api/pass-module', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email, 
              moduleId: Number(id),
              xpToAdd: 500, // Massive XP bonus
              totalLessons: 15
            })
          });
          if (response.ok) {
            const data = await response.json();
            setUser({ ...user, experiencePoints: data.experiencePoints });
          }
        } catch (err) {
          console.error("Failed to save pre-test", err);
        }
      }
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const passed = score >= 12;
    return (
      <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div className="modules__card" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🏆' : '📚'}</div>
          <h2>{passed ? 'You Tested Out!' : 'Keep Learning!'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            You scored {score} out of {MODULE_1_PRETEST.length}.
            {passed ? " The next module is now unlocked and you earned +500 XP!" : " You need 12 correct to test out. Head back to take the regular lessons."}
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
          <span>{progressPercent}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: '#eab308', transition: 'width 0.3s' }} />
        </div>
      </div>

      <div className="modules__card" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginTop: 0, color: '#eab308' }}>Module {id} Pre-Test</h2>
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
        {currentIndex === MODULE_1_PRETEST.length - 1 ? 'Submit Exam' : 'Next Question'}
      </button>
    </div>
  );
}