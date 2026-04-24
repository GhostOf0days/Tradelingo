// Sliders for principal, contribution, rate, and years — shows compound growth over time.
import { useState, useEffect, useRef, useCallback } from 'react';

export default function CompoundGrowthDemo() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const dataRef = useRef<{ year: number; contributed: number; total: number }[]>([]);

  /** Stacked areas for contributions vs growth + optional hover marker for tooltips. */
  const drawChart = useCallback((data: { year: number; contributed: number; total: number }[]) => {
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

    const padL = 65, padR = 15, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const maxVal = Math.max(...data.map(d => d.total)) * 1.1;

    const toX = (i: number) => padL + (i / data.length) * chartW;
    const toY = (v: number) => padT + chartH - (v / maxVal) * chartH;

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padT + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();

      const val = maxVal - (maxVal / gridCount) * i;
      ctx.fillStyle = '#666';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(formatMoney(val), padL - 8, y + 4);
    }

    for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / 6))) {
      const x = toX(i);
      ctx.fillStyle = '#666';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Yr ${data[i].year}`, x, H - 10);
    }

    const contribGrad = ctx.createLinearGradient(0, padT + chartH, 0, padT);
    contribGrad.addColorStop(0, 'rgba(99,102,241,0)');
    contribGrad.addColorStop(1, 'rgba(99,102,241,0.3)');

    ctx.beginPath();
    ctx.moveTo(toX(0), padT + chartH);
    data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.contributed)));
    ctx.lineTo(toX(data.length - 1), padT + chartH);
    ctx.closePath();
    ctx.fillStyle = contribGrad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((d, i) => {
      if (i === 0) ctx.moveTo(toX(0), toY(d.contributed));
      else ctx.lineTo(toX(i), toY(d.contributed));
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();

    const totalGrad = ctx.createLinearGradient(0, padT + chartH, 0, padT);
    totalGrad.addColorStop(0, 'rgba(34,197,94,0)');
    totalGrad.addColorStop(1, 'rgba(34,197,94,0.2)');

    ctx.beginPath();
    ctx.moveTo(toX(0), padT + chartH);
    data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.total)));
    ctx.lineTo(toX(data.length - 1), padT + chartH);
    ctx.closePath();
    ctx.fillStyle = totalGrad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((d, i) => {
      if (i === 0) ctx.moveTo(toX(0), toY(d.total));
      else ctx.lineTo(toX(i), toY(d.total));
    });
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (hoveredYear !== null && hoveredYear < data.length) {
      const d = data[hoveredYear];
      const x = toX(hoveredYear);

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(x, toY(d.total), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, toY(d.contributed), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();

      const tooltipW = 170, tooltipH = 60;
      const tx = Math.min(x + 10, W - padR - tooltipW);
      const ty = Math.max(padT, toY(d.total) - tooltipH - 10);
      ctx.fillStyle = '#1a1a2eee';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      roundRect(ctx, tx, ty, tooltipW, tooltipH, 6);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`Year ${d.year}`, tx + 10, ty + 18);
      ctx.fillStyle = '#22c55e';
      ctx.font = '11px system-ui';
      ctx.fillText(`Total: ${formatMoney(d.total)}`, tx + 10, ty + 34);
      ctx.fillStyle = '#6366f1';
      ctx.fillText(`Contributed: ${formatMoney(d.contributed)}`, tx + 10, ty + 50);
    }
  }, [hoveredYear]);

  // Rebuild the year series whenever inputs change, then paint the canvas.
  useEffect(() => {
    const data: { year: number; contributed: number; total: number }[] = [];
    let balance = initial;
    const monthlyRate = rate / 100 / 12;

    for (let y = 0; y <= years; y++) {
      const contributed = initial + monthly * 12 * y;
      data.push({ year: y, contributed, total: Math.round(balance) });
      for (let m = 0; m < 12; m++) {
        balance = (balance + monthly) * (1 + monthlyRate);
      }
    }
    dataRef.current = data;
    drawChart(data);
  }, [initial, monthly, rate, years, drawChart]);

  /** Map mouse X to nearest simulated year so the tooltip card tracks the cursor. */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const padL = 65, padR = 15;
    const chartW = rect.width - padL - padR;
    const relX = (mx - padL) / chartW;
    const idx = Math.round(relX * dataRef.current.length);
    if (idx >= 0 && idx < dataRef.current.length) {
      setHoveredYear(idx);
    }
  };

  const handleMouseLeave = () => setHoveredYear(null);

  // Redraw when hover index changes so the callout follows the crosshair.
  useEffect(() => {
    drawChart(dataRef.current);
  }, [hoveredYear, drawChart]);

  const finalData = dataRef.current[dataRef.current.length - 1];
  const totalContributed = finalData?.contributed || 0;
  const totalGrowth = (finalData?.total || 0) - totalContributed;

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Compound Interest Growth</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#22c55e', fontFamily: 'monospace' }}>
            {formatMoney(finalData?.total || 0)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>after {years} years</div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: '100%', height: '220px', borderRadius: '0.5rem', display: 'block', cursor: 'crosshair' }}
      />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#6366f1' }} />
          <span style={{ color: '#888', fontSize: '0.8rem' }}>Contributed: {formatMoney(totalContributed)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#22c55e' }} />
          <span style={{ color: '#888', fontSize: '0.8rem' }}>Growth: {formatMoney(totalGrowth)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
        <SliderInput label="Initial Investment" value={initial} min={0} max={100000} step={1000}
          format={v => formatMoney(v)} onChange={setInitial} color="#eab308" />
        <SliderInput label="Monthly Contribution" value={monthly} min={0} max={5000} step={50}
          format={v => formatMoney(v)} onChange={setMonthly} color="#eab308" />
        <SliderInput label="Annual Return %" value={rate} min={1} max={15} step={0.5}
          format={v => `${v}%`} onChange={setRate} color="#22c55e" />
        <SliderInput label="Years" value={years} min={5} max={50} step={1}
          format={v => `${v} yrs`} onChange={setYears} color="#6366f1" />
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Drag the sliders to see how changing contributions, returns, and time affects your future balance.
        Hover over the chart to see values at each year.
      </p>
    </div>
  );
}

/** Thin wrapper so the four sliders share layout and monospace readouts. */
function SliderInput({ label, value, min, max, step, format, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; color: string;
}) {
  return (
    <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ color: '#888', fontSize: '0.75rem' }}>{label}</span>
        <span style={{ color, fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color, height: '4px' }}
      />
    </div>
  );
}

/** Compact axis/tooltip labels (K / M) so big numbers fit the small canvas. */
function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

/** Rounded rectangle path for hover cards (avoids sharp boxy tooltips on the chart). */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
