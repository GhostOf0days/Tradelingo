// Simple leverage math: balance × leverage and rough liquidation awareness for beginners.
import { useState } from 'react';

export default function MarginCalculatorDemo() {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [leverage, setLeverage] = useState(2);
  const [stockChange, setStockChange] = useState(0);

  // Leveraged position: borrowed = notional − cash; equity drives margin-call / liquidation flags below.
  const buyingPower = accountBalance * leverage;
  const borrowed = buyingPower - accountBalance;
  const positionValue = buyingPower * (1 + stockChange / 100);
  const profitLoss = positionValue - buyingPower;
  const equity = accountBalance + profitLoss;
  const equityPercent = positionValue > 0 ? (equity / positionValue) * 100 : 0;
  const returnOnEquity = (profitLoss / accountBalance) * 100;

  const noLeverageValue = accountBalance * (1 + stockChange / 100);
  const noLeveragePL = noLeverageValue - accountBalance;
  const noLeverageReturn = (noLeveragePL / accountBalance) * 100;

  const isMarginCall = equityPercent < 30 && equityPercent > 0;
  const isLiquidated = equity <= 0;

  return (
    <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #222' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>TRADELINGO SIMULATOR</span>
        <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', color: 'white' }}>Margin & Leverage</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#888', fontSize: '0.7rem' }}>Your Cash</span>
            <span style={{ color: '#eab308', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              ${accountBalance.toLocaleString()}
            </span>
          </div>
          <input type="range" min={1000} max={50000} step={1000} value={accountBalance}
            onChange={e => setAccountBalance(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#eab308', height: '4px' }}
          />
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#888', fontSize: '0.7rem' }}>Leverage</span>
            <span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{leverage}x</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={leverage}
            onChange={e => setLeverage(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1', height: '4px' }}
          />
        </div>
        <div style={{ background: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: '#888', fontSize: '0.7rem' }}>Stock Move</span>
            <span style={{
              color: stockChange >= 0 ? '#22c55e' : '#ef4444',
              fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace',
            }}>
              {stockChange >= 0 ? '+' : ''}{stockChange}%
            </span>
          </div>
          <input type="range" min={-50} max={50} step={1} value={stockChange}
            onChange={e => setStockChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: stockChange >= 0 ? '#22c55e' : '#ef4444', height: '4px' }}
          />
        </div>
      </div>

      <div style={{
        background: '#111', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.375rem' }}>With {leverage}x Leverage</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Position Size</span>
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}>${buyingPower.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Borrowed</span>
            <span style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.85rem' }}>${borrowed.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>P&L</span>
            <span style={{ color: profitLoss >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(0)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Return</span>
            <span style={{
              color: returnOnEquity >= 0 ? '#22c55e' : '#ef4444',
              fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold',
            }}>
              {returnOnEquity >= 0 ? '+' : ''}{returnOnEquity.toFixed(1)}%
            </span>
          </div>
        </div>

        <div style={{ width: '1px', height: '100%', background: '#1a1a2e' }} />

        <div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.375rem' }}>Without Leverage (1x)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Position Size</span>
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}>${accountBalance.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Borrowed</span>
            <span style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '0.85rem' }}>$0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1a1a2e' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>P&L</span>
            <span style={{ color: noLeveragePL >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {noLeveragePL >= 0 ? '+' : ''}${noLeveragePL.toFixed(0)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Return</span>
            <span style={{
              color: noLeverageReturn >= 0 ? '#22c55e' : '#ef4444',
              fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold',
            }}>
              {noLeverageReturn >= 0 ? '+' : ''}{noLeverageReturn.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {(isMarginCall || isLiquidated) && (
        <div style={{
          background: isLiquidated ? '#ef444433' : '#eab30833',
          border: `1px solid ${isLiquidated ? '#ef444466' : '#eab30866'}`,
          borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center', marginBottom: '0.5rem',
        }}>
          <span style={{ color: isLiquidated ? '#ef4444' : '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {isLiquidated
              ? 'LIQUIDATED - Your equity is wiped out. You may owe the broker money!'
              : 'MARGIN CALL - Equity below 30%. Deposit more cash or positions will be force-sold!'}
          </span>
        </div>
      )}

      <div style={{
        height: '6px', background: '#1a1a2e', borderRadius: '99px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px', transition: 'width 0.3s, background 0.3s',
          width: `${Math.max(0, Math.min(100, equityPercent))}%`,
          background: equityPercent < 30 ? '#ef4444' : equityPercent < 50 ? '#eab308' : '#22c55e',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#666' }}>Equity: {equityPercent.toFixed(0)}%</span>
        <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Margin call at 30%</span>
      </div>

      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Drag "Stock Move" to see how leverage amplifies both gains AND losses.
        Watch the equity bar — drop below 30% and you get a margin call!
      </p>
    </div>
  );
}
