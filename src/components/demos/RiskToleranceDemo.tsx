// Questionnaire-style widget that maps answers to a conservative ↔ aggressive portfolio mix.
import { useState, useRef, useEffect, useCallback } from 'react';

interface Scenario {
  label: string;
  description: string;
  icon: string;
}

const QUESTIONS: { question: string; options: Scenario[] }[] = [
  {
    question: 'Your $10,000 investment drops 20% in one week. What do you do?',
    options: [
      { label: 'Sell immediately', description: 'Cut losses and protect capital', icon: '🛑' },
      { label: 'Hold and wait', description: 'Stay calm and ride it out', icon: '⏳' },
      { label: 'Buy more', description: 'Stocks are on sale!', icon: '🛒' },
    ],
  },
  {
    question: 'Which best describes your investment timeline?',
    options: [
      { label: 'Under 5 years', description: 'Need the money soon', icon: '📅' },
      { label: '5–15 years', description: 'Mid-term goals', icon: '📆' },
      { label: '15+ years', description: 'Long-term wealth building', icon: '🏗️' },
    ],
  },
  {
    question: 'How would you allocate a bonus of $5,000?',
    options: [
      { label: 'Savings account', description: 'Safe and accessible', icon: '🏦' },
      { label: 'Index fund', description: 'Balanced growth', icon: '📊' },
      { label: 'Individual stocks', description: 'Higher risk, higher reward', icon: '🚀' },
    ],
  },
];

const PROFILES = [
  { name: 'Conservative', color: '#22c55e', stocks: 20, bonds: 60, cash: 20, returns: '3–5%', icon: '🛡️' },
  { name: 'Moderate', color: '#eab308', stocks: 60, bonds: 30, cash: 10, returns: '6–8%', icon: '⚖️' },
  { name: 'Aggressive', color: '#ef4444', stocks: 90, bonds: 5, cash: 5, returns: '8–12%', icon: '🔥' },
];

export default function RiskToleranceDemo() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const score = answers.reduce((sum, a) => sum + a, 0);
  const profileIdx = score <= 2 ? 0 : score <= 5 ? 1 : 2;
  const profile = PROFILES[profileIdx];

  /** Stores option index (0–2) per question; last answer reveals the blended profile. */
  const handleAnswer = (optIdx: number) => {
    const newAnswers = [...answers, optIdx];
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  /** Start the questionnaire over from question 1. */
  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  /** Horizontal stacked bar of stocks/bonds/cash for the suggested profile. */
  const drawAllocation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    const barY = 20;
    const barH = 40;
    const pad = 10;

    const segments = [
      { pct: profile.stocks, color: '#3b82f6', label: `Stocks ${profile.stocks}%` },
      { pct: profile.bonds, color: '#22c55e', label: `Bonds ${profile.bonds}%` },
      { pct: profile.cash, color: '#eab308', label: `Cash ${profile.cash}%` },
    ];

    let x = pad;
    const totalW = W - pad * 2;

    segments.forEach(seg => {
      const segW = (seg.pct / 100) * totalW;
      if (segW <= 0) return;

      ctx.fillStyle = seg.color;
      const radius = 6;
      ctx.beginPath();
      ctx.roundRect(x, barY, segW - 2, barH, radius);
      ctx.fill();

      if (segW > 40) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seg.label, x + segW / 2, barY + barH / 2);
      }
      x += segW;
    });

    ctx.fillStyle = '#888';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`Expected annual return: ${profile.returns}`, W / 2, barY + barH + 25);
  }, [showResult, profile]);

  useEffect(() => { drawAllocation(); }, [drawAllocation]);

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
        <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Risk Tolerance Quiz</h3>
      </div>

      {!showResult ? (
        <>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '99px',
                background: i < currentQ ? '#22c55e' : i === currentQ ? '#6366f1' : '#1a1a2e',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '1rem', fontWeight: 500 }}>
            {QUESTIONS[currentQ].question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {QUESTIONS[currentQ].options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', background: '#111', border: '1px solid #222',
                borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.2s, background 0.2s',
                color: 'white',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#6366f115'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#111'; }}
              >
                <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{opt.label}</div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{
            textAlign: 'center', padding: '1rem', marginBottom: '0.75rem',
            background: `${profile.color}15`, border: `1px solid ${profile.color}33`,
            borderRadius: '0.75rem',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{profile.icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: profile.color }}>{profile.name} Investor</div>
            <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Score: {score}/{(QUESTIONS.length - 1) * 2}
            </div>
          </div>

          <canvas ref={canvasRef} style={{ width: '100%', height: '95px', display: 'block', borderRadius: '0.5rem' }} />

          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
            {PROFILES.map((p, i) => (
              <div key={i} style={{
                flex: 1, padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center',
                background: i === profileIdx ? `${p.color}22` : '#111',
                border: i === profileIdx ? `1px solid ${p.color}44` : '1px solid transparent',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: p.color }}>{p.icon} {p.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#888' }}>{p.returns}/yr</div>
              </div>
            ))}
          </div>

          <button onClick={reset} style={{
            width: '100%', padding: '0.6rem', marginTop: '0.75rem', border: '1px solid #333',
            borderRadius: '0.5rem', background: 'transparent', color: '#888', cursor: 'pointer',
            fontSize: '0.85rem',
          }}>
            ↺ Retake Quiz
          </button>
        </>
      )}

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Answer three quick questions to discover your investor profile and recommended allocation.
      </p>
    </div>
  );
}
