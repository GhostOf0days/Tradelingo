// Visualizes bid/ask levels and a mid price — helps learners picture limit order books.
import { useState, useEffect, useRef, useCallback } from 'react';

interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

/** Builds synthetic bid/ask ladders around mid ± half spread with cumulative size columns. */
function generateOrderBook(midPrice: number, spread: number): { bids: OrderLevel[]; asks: OrderLevel[] } {
  const bids: OrderLevel[] = [];
  const asks: OrderLevel[] = [];

  let bidTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = midPrice - spread / 2 - i * 0.05;
    const size = Math.round((50 + Math.random() * 200 + i * 20) * 100) / 100;
    bidTotal += size;
    bids.push({ price: Math.round(price * 100) / 100, size, total: Math.round(bidTotal * 100) / 100 });
  }

  let askTotal = 0;
  for (let i = 0; i < 10; i++) {
    const price = midPrice + spread / 2 + i * 0.05;
    const size = Math.round((50 + Math.random() * 200 + i * 20) * 100) / 100;
    askTotal += size;
    asks.push({ price: Math.round(price * 100) / 100, size, total: Math.round(askTotal * 100) / 100 });
  }

  return { bids, asks };
}

type OrderType = 'market' | 'limit';
type OrderSide = 'buy' | 'sell';

export default function OrderBookDemo() {
  const [midPrice, setMidPrice] = useState(185.50);
  const [spread, setSpread] = useState(0.10);
  const [book, setBook] = useState(() => generateOrderBook(185.50, 0.10));
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [limitPrice, setLimitPrice] = useState('185.45');
  const [shares, setShares] = useState('100');
  const [lastTrade, setLastTrade] = useState<{ side: string; price: number; shares: number; type: string } | null>(null);
  const [trades, setTrades] = useState<{ time: string; price: number; size: number; side: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Nudges mid/spread slightly so the book feels "live" without heavy simulation. */
  const updateBook = useCallback(() => {
    const drift = (Math.random() - 0.5) * 0.08;
    const newMid = Math.round((midPrice + drift) * 100) / 100;
    const newSpread = Math.max(0.02, Math.min(0.30, spread + (Math.random() - 0.5) * 0.02));
    setMidPrice(newMid);
    setSpread(Math.round(newSpread * 100) / 100);
    setBook(generateOrderBook(newMid, newSpread));
  }, [midPrice, spread]);

  useEffect(() => {
    intervalRef.current = setInterval(updateBook, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [updateBook]);

  /** Records a fake fill at best bid/ask (market) or the typed limit price. */
  const handlePlaceOrder = () => {
    const qty = parseInt(shares) || 0;
    if (qty <= 0) return;

    let executionPrice: number;
    if (orderType === 'market') {
      executionPrice = orderSide === 'buy' ? book.asks[0].price : book.bids[0].price;
    } else {
      executionPrice = parseFloat(limitPrice) || midPrice;
    }

    setLastTrade({ side: orderSide, price: executionPrice, shares: qty, type: orderType });
    setTrades(prev => [{
      time: new Date().toLocaleTimeString(),
      price: executionPrice,
      size: qty,
      side: orderSide,
    }, ...prev].slice(0, 8));
  };

  // Normalizes bar widths in the depth chart so the largest level fills the row.
  const maxTotal = Math.max(
    book.bids[book.bids.length - 1]?.total || 1,
    book.asks[book.asks.length - 1]?.total || 1
  );

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
          <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Live Order Book</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#eab308', fontFamily: 'monospace' }}>
            ${midPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>Spread: ${spread.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0.5rem', fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #1a1a2e' }}>
            <span>Price</span><span>Size</span><span>Total</span>
          </div>
          {book.bids.map((level, i) => (
            <div key={i} style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
              <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: `${(level.total / maxTotal) * 100}%`,
                background: 'rgba(34,197,94,0.08)', transition: 'width 0.5s'
              }} />
              <span style={{ color: '#22c55e', fontFamily: 'monospace', zIndex: 1 }}>${level.price.toFixed(2)}</span>
              <span style={{ color: '#888', fontFamily: 'monospace', zIndex: 1 }}>{level.size.toFixed(0)}</span>
              <span style={{ color: '#555', fontFamily: 'monospace', zIndex: 1 }}>{level.total.toFixed(0)}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0.5rem', fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #1a1a2e' }}>
            <span>Price</span><span>Size</span><span>Total</span>
          </div>
          {book.asks.map((level, i) => (
            <div key={i} style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(level.total / maxTotal) * 100}%`,
                background: 'rgba(239,68,68,0.08)', transition: 'width 0.5s'
              }} />
              <span style={{ color: '#ef4444', fontFamily: 'monospace', zIndex: 1 }}>${level.price.toFixed(2)}</span>
              <span style={{ color: '#888', fontFamily: 'monospace', zIndex: 1 }}>{level.size.toFixed(0)}</span>
              <span style={{ color: '#555', fontFamily: 'monospace', zIndex: 1 }}>{level.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#111', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
            {(['buy', 'sell'] as const).map(side => (
              <button key={side} onClick={() => setOrderSide(side)} style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
                background: orderSide === side ? (side === 'buy' ? '#22c55e' : '#ef4444') : '#1a1a2e',
                color: orderSide === side ? (side === 'buy' ? 'black' : 'white') : '#888',
                fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase'
              }}>
                {side}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
            {(['market', 'limit'] as const).map(type => (
              <button key={type} onClick={() => setOrderType(type)} style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
                background: orderType === type ? '#6366f1' : '#1a1a2e',
                color: orderType === type ? 'white' : '#888',
                fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase'
              }}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#666', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Shares</label>
            <input type="number" value={shares} onChange={e => setShares(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '0.375rem', color: 'white', fontSize: '0.9rem', fontFamily: 'monospace' }}
            />
          </div>
          {orderType === 'limit' && (
            <div style={{ flex: 1 }}>
              <label style={{ color: '#666', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Limit Price</label>
              <input type="number" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} step="0.01"
                style={{ width: '100%', padding: '0.5rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '0.375rem', color: 'white', fontSize: '0.9rem', fontFamily: 'monospace' }}
              />
            </div>
          )}
        </div>

        <button onClick={handlePlaceOrder} style={{
          width: '100%', padding: '0.6rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
          background: orderSide === 'buy' ? '#22c55e' : '#ef4444',
          color: orderSide === 'buy' ? 'black' : 'white',
          fontWeight: 'bold', fontSize: '0.85rem'
        }}>
          Place {orderType === 'market' ? 'Market' : 'Limit'} {orderSide === 'buy' ? 'Buy' : 'Sell'} Order
        </button>
      </div>

      {lastTrade && (
        <div style={{
          background: lastTrade.side === 'buy' ? '#22c55e15' : '#ef444415',
          border: `1px solid ${lastTrade.side === 'buy' ? '#22c55e44' : '#ef444444'}`,
          borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem', textAlign: 'center'
        }}>
          <span style={{ color: lastTrade.side === 'buy' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
            {lastTrade.type === 'market' ? '⚡ Market' : '📋 Limit'} {lastTrade.side.toUpperCase()} executed:
          </span>
          <span style={{ color: 'white', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
            {lastTrade.shares} shares @ ${lastTrade.price.toFixed(2)}
          </span>
          <span style={{ color: '#888', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
            = ${(lastTrade.shares * lastTrade.price).toFixed(2)}
          </span>
        </div>
      )}

      {trades.length > 0 && (
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#666', padding: '0.25rem 0.5rem', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between' }}>
            <span>Time</span><span>Side</span><span>Price</span><span>Size</span>
          </div>
          {trades.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0.5rem', fontSize: '0.75rem', opacity: 1 - i * 0.1 }}>
              <span style={{ color: '#666', fontFamily: 'monospace' }}>{t.time}</span>
              <span style={{ color: t.side === 'buy' ? '#22c55e' : '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.side}</span>
              <span style={{ color: '#ddd', fontFamily: 'monospace' }}>${t.price.toFixed(2)}</span>
              <span style={{ color: '#888', fontFamily: 'monospace' }}>{t.size}</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Green (left) = buy orders waiting. Red (right) = sell orders waiting. The gap is the "spread."
        Try placing market and limit orders to see how they interact with the book.
      </p>
    </div>
  );
}
