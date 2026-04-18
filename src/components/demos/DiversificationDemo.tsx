// Multiple fake stocks with different volatility; shows how blending them smooths portfolio swings.
import { useState, useRef, useEffect, useCallback } from 'react';

interface Stock {
  name: string;
  color: string;
  baseReturn: number;
  volatility: number;
}

const STOCKS: Stock[] = [
  { name: 'Tech Co', color: '#3b82f6', baseReturn: 0.12, volatility: 0.35 },
  { name: 'Health Inc', color: '#22c55e', baseReturn: 0.09, volatility: 0.2 },
  { name: 'Energy Ltd', color: '#f59e0b', baseReturn: 0.07, volatility: 0.3 },
  { name: 'Finance Corp', color: '#8b5cf6', baseReturn: 0.08, volatility: 0.25 },
  { name: 'Consumer Co', color: '#ec4899', baseReturn: 0.06, volatility: 0.15 },
];

/** Monte-Carlo-ish yearly step: each selected line gets a random shock around its base return. */
function simulate(selectedStocks: boolean[], years: number): { year: number; values: number[]; portfolioValue: number }[] {
  const activeCount = selectedStocks.filter(Boolean).length;
  if (activeCount === 0) return [];

  const data: { year: number; values: number[]; portfolioValue: number }[] = [];
  const values = STOCKS.map(() => 10000);
  const rng = seedRandom(42);

  for (let y = 0; y <= years; y++) {
    const activeValues = values.filter((_, i) => selectedStocks[i]);
    const portfolioValue = activeValues.reduce((a, b) => a + b, 0) / activeCount;
    data.push({ year: y, values: [...values], portfolioValue });

    for (let i = 0; i < STOCKS.length; i++) {
      if (!selectedStocks[i]) continue;
      const shock = (rng() - 0.5) * 2 * STOCKS[i].volatility;
      const returnRate = STOCKS[i].baseReturn + shock;
      values[i] = Math.max(100, values[i] * (1 + returnRate));
    }
  }
  return data;
}

/** Tiny PRNG so the chart is reproducible while still looking random. */
function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function DiversificationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState([true, true, true, true, true]);
  const years = 15;

  const data = simulate(selected, years);

  /** Canvas redraw: per-stock faint lines + bold equal-weight portfolio line. */
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
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

    const padL = 55, padR = 15, padT = 15, padB = 35;
    const cW = W - padL - padR;
    const cH = H - padT - padB;

    const allVals: number[] = [];
    data.forEach(d => {
      d.values.forEach((v, i) => { if (selected[i]) allVals.push(v); });
      allVals.push(d.portfolioValue);
    });
    const maxV = Math.max(...allVals) * 1.1;
    const minV = Math.min(...allVals) * 0.9;
    const range = maxV - minV || 1;

    const toX = (i: number) => padL + (i / (data.length - 1)) * cW;
    const toY = (v: number) => padT + cH - ((v - minV) / range) * cH;

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      const val = maxV - (range / 4) * i;
      ctx.fillStyle = '#666';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`$${(val / 1000).toFixed(0)}K`, padL - 6, y + 4);
    }

    for (let i = 0; i < data.length; i += 3) {
      ctx.fillStyle = '#555';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Yr ${data[i].year}`, toX(i), H - 8);
    }

    STOCKS.forEach((stock, si) => {
      if (!selected[si]) return;
      ctx.beginPath();
      data.forEach((d, i) => {
        if (i === 0) ctx.moveTo(toX(0), toY(d.values[si]));
        else ctx.lineTo(toX(i), toY(d.values[si]));
      });
      ctx.strokeStyle = stock.color + '66';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.beginPath();
    data.forEach((d, i) => {
      if (i === 0) ctx.moveTo(toX(0), toY(d.portfolioValue));
      else ctx.lineTo(toX(i), toY(d.portfolioValue));
    });
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }, [data, selected]);

  useEffect(() => { drawChart(); }, [drawChart]);

  /** Flip inclusion; ensures at least one name stays on so the chart never divides by zero. */
  const toggleStock = (idx: number) => {
    setSelected(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      if (next.every(s => !s)) next[idx] = true;
      return next;
    });
  };

  const activeCount = selected.filter(Boolean).length;
  const lastData = data[data.length - 1];
  const finalPortfolio = lastData?.portfolioValue ?? 10000;
  const maxSingleStock = lastData ? Math.max(...lastData.values.filter((_, i) => selected[i])) : 10000;
  const minSingleStock = lastData ? Math.min(...lastData.values.filter((_, i) => selected[i])) : 10000;

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Diversification Explorer</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>{activeCount} stock{activeCount !== 1 ? 's' : ''} selected</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: '100%', height: '200px', borderRadius: '0.5rem', display: 'block' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1rem' }}>
        {STOCKS.map((stock, i) => (
          <button key={i} onClick={() => toggleStock(i)} style={{
            padding: '0.4rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 'bold', border: 'none',
            background: selected[i] ? stock.color + '33' : '#1a1a2e',
            color: selected[i] ? stock.color : '#555',
            outline: selected[i] ? `1px solid ${stock.color}55` : 'none',
          }}>
            {stock.name}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginLeft: 'auto' }}>
          <div style={{ width: 16, height: 2, background: '#fff' }} />
          <span style={{ fontSize: '0.7rem', color: '#888' }}>Portfolio Avg</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Portfolio Avg</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>
            ${(finalPortfolio / 1000).toFixed(1)}K
          </div>
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Best Stock</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' }}>
            ${(maxSingleStock / 1000).toFixed(1)}K
          </div>
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#888' }}>Worst Stock</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ef4444', fontFamily: 'monospace' }}>
            ${(minSingleStock / 1000).toFixed(1)}K
          </div>
        </div>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Toggle stocks to see how diversification smooths out the ride. The white line (portfolio average)
        is less volatile than any single stock.
      </p>
    </div>
  );
}
