import { useState, useRef, useEffect, useCallback } from 'react';

interface AssetClass {
  name: string;
  color: string;
  expectedReturn: number;
  risk: number;
}

const ASSETS: AssetClass[] = [
  { name: 'Stocks', color: '#3b82f6', expectedReturn: 10, risk: 20 },
  { name: 'Bonds', color: '#22c55e', expectedReturn: 4, risk: 6 },
  { name: 'Cash', color: '#eab308', expectedReturn: 2, risk: 1 },
  { name: 'Real Estate', color: '#8b5cf6', expectedReturn: 7, risk: 12 },
  { name: 'Crypto', color: '#ec4899', expectedReturn: 15, risk: 50 },
];

const PRESETS = [
  { label: 'Conservative', alloc: [20, 50, 20, 10, 0] },
  { label: 'Balanced', alloc: [50, 30, 10, 10, 0] },
  { label: 'Aggressive', alloc: [70, 10, 5, 10, 5] },
];

export default function PortfolioAllocationDemo() {
  const [allocations, setAllocations] = useState([50, 30, 10, 10, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const total = allocations.reduce((a, b) => a + b, 0);
  const weightedReturn = ASSETS.reduce((sum, a, i) => sum + (a.expectedReturn * allocations[i]) / 100, 0);
  const weightedRisk = ASSETS.reduce((sum, a, i) => sum + (a.risk * allocations[i]) / 100, 0);

  const drawPie = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 180;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = 70;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, size, size);

    let startAngle = -Math.PI / 2;
    ASSETS.forEach((asset, i) => {
      if (allocations[i] <= 0) return;
      const sliceAngle = (allocations[i] / (total || 1)) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = asset.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${weightedReturn.toFixed(1)}%`, cx, cy - 6);
    ctx.fillStyle = '#888';
    ctx.font = '10px system-ui';
    ctx.fillText('exp. return', cx, cy + 12);
  }, [allocations, total, weightedReturn]);

  useEffect(() => { drawPie(); }, [drawPie]);

  const handleChange = (idx: number, val: number) => {
    setAllocations(prev => {
      const next = [...prev];
      next[idx] = Math.max(0, Math.min(100, val));
      return next;
    });
  };

  const applyPreset = (alloc: number[]) => setAllocations([...alloc]);

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
        <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Portfolio Allocator</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p.alloc)} style={{
            flex: 1, padding: '0.4rem', border: 'none', borderRadius: '0.375rem',
            background: '#1a1a2e', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <canvas ref={canvasRef} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ASSETS.map((asset, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: asset.color }} />
                  <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{asset.name}</span>
                </div>
                <span style={{ color: asset.color, fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {allocations[i]}%
                </span>
              </div>
              <input type="range" min={0} max={100} step={5} value={allocations[i]}
                onChange={e => handleChange(i, Number(e.target.value))}
                style={{ width: '100%', accentColor: asset.color, height: '4px' }}
              />
            </div>
          ))}
        </div>
      </div>

      {total !== 100 && (
        <div style={{
          background: '#ef444422', border: '1px solid #ef444444', borderRadius: '0.5rem',
          padding: '0.5rem', marginTop: '0.75rem', textAlign: 'center',
          color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold'
        }}>
          Total allocation: {total}% (should equal 100%)
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Expected Return</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' }}>
            {weightedReturn.toFixed(1)}%
          </div>
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Portfolio Risk</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: weightedRisk > 20 ? '#ef4444' : weightedRisk > 12 ? '#eab308' : '#22c55e', fontFamily: 'monospace' }}>
            {weightedRisk.toFixed(1)}%
          </div>
        </div>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Adjust sliders to build your portfolio. More stocks = higher return & risk.
        Try the presets to see how different strategies balance risk and reward.
      </p>
    </div>
  );
}
