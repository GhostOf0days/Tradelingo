// Linear lesson flow: read content → end-of-module quiz. Passing the quiz (80%+) completes
// the module, awards XP, and (unless ?review=true) writes progress to the API.
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { MODULES } from '../data/modules';
import { LessonItem } from '../models/LessonItem';
import confetti from 'canvas-confetti';
import DemoRenderer from '../components/demos/DemoRegistry';

type Phase = 'reading' | 'quiz' | 'quiz-result' | 'complete';

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, updateStreak } = useUser();
  
  const queryParams = new URLSearchParams(location.search);
  // Review mode = reread without mutating progress or re-awarding XP.
  const isReviewMode = queryParams.get('review') === 'true';
  
  const moduleId = Number(id) || 1;
  const moduleData = MODULES[moduleId as keyof typeof MODULES] || MODULES[1];
  const moduleLessons: LessonItem[] = moduleData.lessons;
  
  const [phase, setPhase] = useState<Phase>('reading');
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);

  // One quiz row per lesson: pulls the embedded multiple-choice from each lesson object.
  const allQuestions = moduleLessons.map((l, idx) => ({
    lessonIndex: idx,
    lessonTitle: l.title,
    question: l.question.question,
    options: l.question.options,
    correctIndex: l.question.correctIndex,
  }));

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      setIsLoading(true);
      try {
        // Review: always start at lesson 1; no redirect if they already "completed" the module.
        if (isReviewMode) {
          setCurrentLessonIdx(0);
          setPhase('reading');
        } else {
          const res = await fetch(`/api/progress/${user.email}`);
          if (!res.ok) throw new Error('Failed to reach database');
          const data = await res.json();
          const currentIdx = data.progressByModuleId?.[moduleId]?.lessonCurrent || 0;
          // Server already marked every lesson done; send them back to the module list.
          if (currentIdx >= moduleLessons.length) {
            navigate('/');
          } else {
            setCurrentLessonIdx(0);
            setPhase('reading');
          }
        }
      } catch {
        setCurrentLessonIdx(0);
        setPhase('reading');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [user, id]);

  /** Advance slides, or jump into the module quiz after the last lesson. */
  const handleNextLesson = () => {
    if (currentLessonIdx < moduleLessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else {
      setPhase('quiz');
      setQuizQuestionIdx(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      setQuizAnswers(new Array(allQuestions.length).fill(null));
    }
  };

  /** Records the pick, updates running score, then either moves to the next quiz Q or finishes. */
  const handleSubmitAnswer = () => {
    const updatedAnswers = [...quizAnswers];
    updatedAnswers[quizQuestionIdx] = selectedAnswer;
    setQuizAnswers(updatedAnswers);

    let newScore = quizScore;
    if (selectedAnswer === allQuestions[quizQuestionIdx].correctIndex) {
      newScore += 1;
      setQuizScore(newScore);
    }

    if (quizQuestionIdx < allQuestions.length - 1) {
      setQuizQuestionIdx(quizQuestionIdx + 1);
      setSelectedAnswer(null);
    } else {
      setPhase('quiz-result');
      handleModuleComplete(newScore, updatedAnswers);
    }
  };

  /** On pass: confetti + optional API calls to sync XP and completion (skipped in review mode). */
  const handleModuleComplete = async (finalScore: number, _answers: (number | null)[]) => {
    const percentage = Math.round((finalScore / allQuestions.length) * 100);
    const passed = percentage >= 80;

    if (passed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7']
      });
    }

    // Backend tracks per-lesson increments; we fire one request per lesson, then finalize the module.
    if (user && !isReviewMode && passed) {
      try {
        for (let i = 0; i < moduleLessons.length; i++) {
          await fetch('/api/complete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, moduleId, xpToAdd: 50 })
          });
        }

        const completeRes = await fetch('/api/complete-module', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            moduleId,
            title: moduleData.title,
            score: percentage,
            xpEarned: moduleData.experiencePoints,
            lessonsTotal: moduleLessons.length
          })
        });
        const completeData = await completeRes.json();

        const userRes = await fetch(`/api/user/${user.email}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({ ...user, experiencePoints: userData.experiencePoints });
        } else {
          setUser({ ...user, experiencePoints: (completeData.experiencePoints || user.experiencePoints) });
        }
        updateStreak();
      } catch (err) {
        console.warn('Error completing module:', err);
      }
    }
  };

  /** Reset quiz state after a failed attempt so they can try again from question 1. */
  const handleRetryQuiz = () => {
    setPhase('quiz');
    setQuizQuestionIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizAnswers(new Array(allQuestions.length).fill(null));
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  // Progress bar spans both reading steps and quiz questions in one linear sequence.
  const totalSteps = moduleLessons.length + allQuestions.length;
  const currentStep = phase === 'reading'
    ? currentLessonIdx
    : phase === 'quiz'
      ? moduleLessons.length + quizQuestionIdx
      : totalSteps;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ padding: '2rem', maxWidth: '90%', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {phase === 'reading' ? `Lesson ${currentLessonIdx + 1} of ${moduleLessons.length}` :
               phase === 'quiz' ? `Quiz Question ${quizQuestionIdx + 1} of ${allQuestions.length}` :
               isReviewMode ? 'Review Complete' : 'Module Complete'}
            </span>
            <span style={{ fontWeight: 'bold' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '12px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: isReviewMode ? '#22c55e' : phase === 'quiz' || phase === 'quiz-result' ? '#6366f1' : 'var(--accent)',
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
        
        {!isReviewMode && phase === 'reading' && (
          <button onClick={() => navigate(`/pretest/${id}`)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '2px solid #eab308', color: '#eab308', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Test Out</button>
        )}
      </div>

      {phase === 'reading' && (
        <div style={{
          display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem',
          marginBottom: '1rem', scrollbarWidth: 'thin',
        }}>
          {moduleLessons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { if (idx <= currentLessonIdx || isReviewMode) setCurrentLessonIdx(idx); }}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '99px', border: 'none', cursor: idx <= currentLessonIdx || isReviewMode ? 'pointer' : 'default',
                whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: idx === currentLessonIdx ? 'bold' : 'normal',
                background: idx === currentLessonIdx ? 'var(--accent)' : idx < currentLessonIdx ? 'var(--surface-hover)' : 'var(--surface)',
                color: idx === currentLessonIdx ? 'white' : idx < currentLessonIdx ? 'var(--text-muted)' : 'var(--text-muted-strong)',
                opacity: idx <= currentLessonIdx || isReviewMode ? 1 : 0.5,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <div className="modules__card" style={{ padding: '2.5rem' }}>
        {phase === 'reading' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'var(--accent)', color: 'white', padding: '0.15rem 0.5rem',
                borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold',
              }}>
                {currentLessonIdx + 1} / {moduleLessons.length}
              </span>
              {moduleLessons[currentLessonIdx].demo && (
                <span style={{
                  background: '#22c55e22', color: '#22c55e', padding: '0.15rem 0.5rem',
                  borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold',
                }}>
                  Interactive Demo
                </span>
              )}
            </div>
            <h2 style={{ marginTop: 0 }}>{moduleLessons[currentLessonIdx].title}</h2>
            <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
              {moduleLessons[currentLessonIdx].content}
            </p>
            {moduleLessons[currentLessonIdx].demo && (
              <DemoRenderer demoId={moduleLessons[currentLessonIdx].demo!} />
            )}
            {currentLessonIdx < moduleLessons.length - 1 && (
              <div style={{
                marginTop: '2rem', padding: '1rem', background: 'var(--surface)',
                borderRadius: '0.75rem', borderLeft: '3px solid var(--accent)',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Up next: <strong style={{ color: 'var(--text-primary)' }}>{moduleLessons[currentLessonIdx + 1].title}</strong>
                </span>
              </div>
            )}
            {currentLessonIdx === moduleLessons.length - 1 && (
              <div style={{
                marginTop: '2rem', padding: '1rem', background: '#6366f115',
                borderRadius: '0.75rem', borderLeft: '3px solid #6366f1',
              }}>
                <span style={{ color: '#a5b4fc', fontSize: '0.85rem' }}>
                  That's the last lesson! Next up: <strong>Module Quiz</strong> — you need 80% to pass.
                </span>
              </div>
            )}
          </>
        )}

        {phase === 'quiz' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ background: '#6366f1', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                From: {allQuestions[quizQuestionIdx].lessonTitle}
              </span>
            </div>
            <h2 style={{ marginTop: 0 }}>Module Quiz</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{allQuestions[quizQuestionIdx].question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allQuestions[quizQuestionIdx].options.map((opt: string, idx: number) => (
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

        {phase === 'quiz-result' && (() => {
          const percentage = Math.round((quizScore / allQuestions.length) * 100);
          const passed = percentage >= 80;
          const xpEarned = passed ? moduleData.experiencePoints + (moduleLessons.length * 50) : 0;
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>{passed ? '🎉' : '📚'}</div>
              <h2>{passed ? (isReviewMode ? 'Review Complete!' : 'Module Complete!') : 'Not Quite!'}</h2>
              <div style={{ background: 'var(--surface-hover)', borderRadius: '0.75rem', padding: '1.5rem', margin: '1.5rem 0' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>Your Score</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>{quizScore} / {allQuestions.length}</p>
                <p style={{ fontSize: '1.5rem', color: passed ? '#22c55e' : '#ef4444', fontWeight: 600, margin: 0 }}>{percentage}%</p>
              </div>
              {passed ? (
                <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #d4af37 100%)', borderRadius: '0.75rem', padding: '1.5rem', color: 'black', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem' }}>🏆 {isReviewMode ? 'Great Review!' : 'XP Earned'}</p>
                  {!isReviewMode && <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>+{xpEarned} XP</p>}
                </div>
              ) : (
                <div style={{ background: 'var(--surface-hover)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <p>You need 80% to pass. Review the lessons and try again!</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="modules__card-btn" onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>
                  {isReviewMode ? 'Exit Review' : 'Back to Modules'}
                </button>
                {!passed && (
                  <button className="modules__card-btn" onClick={handleRetryQuiz}>
                    Retry Quiz
                  </button>
                )}
                {!passed && (
                  <button className="modules__card-btn" onClick={() => { setPhase('reading'); setCurrentLessonIdx(0); }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>
                    Re-read Lessons
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {phase === 'reading' && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {currentLessonIdx > 0 && (
            <button 
              className="modules__card-btn" 
              style={{ flex: '0 0 auto', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              onClick={() => setCurrentLessonIdx(currentLessonIdx - 1)}
            >
              ← Previous
            </button>
          )}
          <button 
            className="modules__card-btn" 
            style={{ flex: 1, justifyContent: 'center', background: isReviewMode ? '#22c55e' : '' }}
            onClick={handleNextLesson}
          >
            {currentLessonIdx < moduleLessons.length - 1 ? 'Next Lesson →' : 'Start Module Quiz'}
          </button>
        </div>
      )}

      {phase === 'quiz' && (
        <button 
          className="modules__card-btn" 
          style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', background: '#6366f1' }}
          onClick={handleSubmitAnswer}
          disabled={selectedAnswer === null}
        >
          {quizQuestionIdx < allQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </button>
      )}
    </div>
  );
}
