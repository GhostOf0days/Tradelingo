// Animated candlestick-style demo: fake price stream + canvas drawing for lessons on markets.
import { useState, useRef, useEffect, useCallback } from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export default function StockPriceDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [price, setPrice] = useState(150);
  const [trend, setTrend] = useState<'bull' | 'bear' | 'neutral'>('neutral');
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const priceRef = useRef(150);

  /** One OHLC bar; `bias` skews random walk when user picks bull/bear mode. */
  const generateCandle = useCallback((currentPrice: number, bias: number): Candle => {
    const volatility = 2 + Math.random() * 4;
    const direction = Math.random() + bias;
    const change = direction > 0.5 ? volatility : -volatility;
    const open = currentPrice;
    const close = Math.max(10, open + change);
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    return { open, close, high: Math.max(10, high), low: Math.max(5, low), volume: 50 + Math.random() * 100 };
  }, []);

  /** Renders grid, candles, volume bars, and last-price guide on the canvas. */
  const drawChart = useCallback((data: Candle[]) => {
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

    if (data.length === 0) return;

    const allPrices = data.flatMap(c => [c.high, c.low]);
    const minP = Math.min(...allPrices) - 5;
    const maxP = Math.max(...allPrices) + 5;
    const range = maxP - minP || 1;

    const chartH = H - 60;
    const chartY = 20;
    const toY = (p: number) => chartY + chartH - ((p - minP) / range) * chartH;

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = chartY + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(W - 10, y);
      ctx.stroke();

      const priceLabel = maxP - (range / gridLines) * i;
      ctx.fillStyle = '#666';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`$${priceLabel.toFixed(0)}`, 36, y + 4);
    }

    const maxCandles = 40;
    const visible = data.slice(-maxCandles);
    const candleW = Math.max(4, (W - 60) / maxCandles - 2);
    const gap = 2;

    visible.forEach((c, i) => {
      const x = 50 + i * (candleW + gap);
      const isGreen = c.close >= c.open;

      ctx.strokeStyle = isGreen ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleW / 2, toY(c.high));
      ctx.lineTo(x + candleW / 2, toY(c.low));
      ctx.stroke();

      ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444';
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBot = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBot - bodyTop);
      ctx.fillRect(x, bodyTop, candleW, bodyH);

      ctx.fillStyle = isGreen ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
      const volH = (c.volume / 150) * 30;
      ctx.fillRect(x, H - 30 - volH, candleW, volH);
    });

    const lastCandle = visible[visible.length - 1];
    if (lastCandle) {
      const lastY = toY(lastCandle.close);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = lastCandle.close >= lastCandle.open ? '#22c55e88' : '#ef444488';
      ctx.beginPath();
      ctx.moveTo(40, lastY);
      ctx.lineTo(W - 10, lastY);
      ctx.stroke();
      ctx.setLineDash([]);

      const labelColor = lastCandle.close >= lastCandle.open ? '#22c55e' : '#ef4444';
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`$${lastCandle.close.toFixed(2)}`, W - 70, lastY - 6);
    }
  }, []);

  useEffect(() => {
    drawChart(candles);
  }, [candles, drawChart]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /** Appends candles on an interval; keeps last 60 for performance. */
  const startSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      const bias = trend === 'bull' ? 0.2 : trend === 'bear' ? -0.2 : 0;
      const newCandle = generateCandle(priceRef.current, bias);
      priceRef.current = newCandle.close;
      setPrice(newCandle.close);
      setCandles(prev => {
        const updated = [...prev, newCandle];
        return updated.slice(-60);
      });
    }, 400);
  };

  /** Stops the interval but leaves candles on screen so students can inspect the run. */
  const stopSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  /** Clears history and price so the learner can rerun from a known starting point. */
  const resetSimulation = () => {
    stopSimulation();
    setCandles([]);
    setPrice(150);
    priceRef.current = 150;
    setTrend('neutral');
  };

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Live Stock Price</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: price >= 150 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>
            ${price.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: price >= 150 ? '#22c55e' : '#ef4444' }}>
            {price >= 150 ? '▲' : '▼'} {Math.abs(((price - 150) / 150) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '220px', borderRadius: '0.5rem', display: 'block' }}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
          {(['bull', 'neutral', 'bear'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTrend(t)}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase',
                background: trend === t
                  ? t === 'bull' ? '#22c55e' : t === 'bear' ? '#ef4444' : '#6366f1'
                  : '#1a1a2e',
                color: trend === t ? (t === 'neutral' ? 'white' : 'black') : '#888',
              }}
            >
              {t === 'bull' ? 'Bull' : t === 'bear' ? 'Bear' : 'Neutral'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={isRunning ? stopSimulation : startSimulation} style={{
            padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
            background: isRunning ? '#ef4444' : '#22c55e', color: isRunning ? 'white' : 'black', fontWeight: 'bold', fontSize: '0.8rem'
          }}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetSimulation} style={{
            padding: '0.5rem 0.75rem', border: '1px solid #333', borderRadius: '0.5rem', cursor: 'pointer',
            background: 'transparent', color: '#888', fontSize: '0.8rem'
          }}>
            Reset
          </button>
        </div>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Select a market trend, then hit Start to watch the candlestick chart build in real time.
        Green candles = price went up. Red candles = price went down.
      </p>
    </div>
  );
}
