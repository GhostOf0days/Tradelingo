import { useState, useRef, useEffect, useCallback } from 'react';

function generatePricePath(months: number, seed: number): number[] {
  const prices = [100];
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  for (let i = 1; i <= months; i++) {
    const trend = 0.005;
    const noise = (rng() - 0.5) * 0.12;
    const cyclical = Math.sin(i / 6) * 0.03;
    prices.push(Math.max(20, prices[i - 1] * (1 + trend + noise + cyclical)));
  }
  return prices;
}

export default function DollarCostAverageDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [monthlyAmount, setMonthlyAmount] = useState(200);
  const [months, setMonths] = useState(24);

  const prices = generatePricePath(months, 314159);

  const dcaShares = prices.slice(0, -1).reduce((sum, p) => sum + monthlyAmount / p, 0);
  const dcaTotalInvested = monthlyAmount * months;
  const dcaValue = dcaShares * prices[prices.length - 1];
  const dcaAvgPrice = dcaTotalInvested / dcaShares;

  const lumpShares = (monthlyAmount * months) / prices[0];
  const lumpValue = lumpShares * prices[prices.length - 1];

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    const padL = 50, padR = 15, padT = 15, padB = 30;
    const cW = W - padL - padR;
    const cH = H - padT - padB;

    const maxP = Math.max(...prices) * 1.1;
    const minP = Math.min(...prices) * 0.9;
    const range = maxP - minP || 1;

    const toX = (i: number) => padL + (i / (prices.length - 1)) * cW;
    const toY = (v: number) => padT + cH - ((v - minP) / range) * cH;

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      const val = maxP - (range / 4) * i;
      ctx.fillStyle = '#666';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`$${val.toFixed(0)}`, padL - 6, y + 4);
    }

    const grad = ctx.createLinearGradient(0, padT, 0, padT + cH);
    grad.addColorStop(0, 'rgba(59,130,246,0.15)');
    grad.addColorStop(1, 'rgba(59,130,246,0)');

    ctx.beginPath();
    ctx.moveTo(toX(0), padT + cH);
    prices.forEach((p, i) => ctx.lineTo(toX(i), toY(p)));
    ctx.lineTo(toX(prices.length - 1), padT + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    prices.forEach((p, i) => {
      if (i === 0) ctx.moveTo(toX(0), toY(p));
      else ctx.lineTo(toX(i), toY(p));
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    const avgY = toY(dcaAvgPrice);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#22c55e88';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, avgY);
    ctx.lineTo(W - padR, avgY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`DCA Avg: $${dcaAvgPrice.toFixed(2)}`, padL + 5, avgY - 6);

    for (let i = 0; i < prices.length - 1; i += 1) {
      const x = toX(i);
      const y = toY(prices[i]);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [prices, dcaAvgPrice]);

  useEffect(() => { drawChart(); }, [drawChart]);

  const dcaReturn = ((dcaValue - dcaTotalInvested) / dcaTotalInvested) * 100;
  const lumpReturn = ((lumpValue - dcaTotalInvested) / dcaTotalInvested) * 100;

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Dollar-Cost Averaging</h3>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: '100%', height: '200px', borderRadius: '0.5rem', display: 'block' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#888', fontSize: '0.75rem' }}>Monthly Invest</span>
            <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace' }}>${monthlyAmount}</span>
          </div>
          <input type="range" min={50} max={1000} step={50} value={monthlyAmount}
            onChange={e => setMonthlyAmount(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#eab308', height: '4px' }}
          />
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#888', fontSize: '0.75rem' }}>Months</span>
            <span style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{months}</span>
          </div>
          <input type="range" min={6} max={60} step={6} value={months}
            onChange={e => setMonths(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1', height: '4px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
        <div style={{
          background: '#22c55e11', border: '1px solid #22c55e33', borderRadius: '0.5rem',
          padding: '0.75rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 'bold', marginBottom: '0.25rem' }}>DCA Strategy</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>
            ${dcaValue.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.7rem', color: dcaReturn >= 0 ? '#22c55e' : '#ef4444' }}>
            {dcaReturn >= 0 ? '+' : ''}{dcaReturn.toFixed(1)}% return
          </div>
        </div>
        <div style={{
          background: '#3b82f611', border: '1px solid #3b82f633', borderRadius: '0.5rem',
          padding: '0.75rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '0.25rem' }}>Lump Sum (Day 1)</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>
            ${lumpValue.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.7rem', color: lumpReturn >= 0 ? '#22c55e' : '#ef4444' }}>
            {lumpReturn >= 0 ? '+' : ''}{lumpReturn.toFixed(1)}% return
          </div>
        </div>
      </div>

      <div style={{
        background: '#111', borderRadius: '0.5rem', padding: '0.6rem', marginTop: '0.5rem',
        textAlign: 'center', fontSize: '0.8rem', color: '#888'
      }}>
        Total invested: <span style={{ color: '#fff', fontWeight: 'bold' }}>${dcaTotalInvested.toLocaleString()}</span>
        &nbsp;&middot;&nbsp;
        DCA avg price: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>${dcaAvgPrice.toFixed(2)}</span>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        DCA invests a fixed amount each month regardless of price. Green dots show each purchase.
        The dashed line shows your average cost — often lower than buying all at once.
      </p>
    </div>
  );
}
