import { lazy, Suspense } from 'react';

const StockPriceDemo = lazy(() => import('./StockPriceDemo'));
const CompoundGrowthDemo = lazy(() => import('./CompoundGrowthDemo'));
const BlockchainDemo = lazy(() => import('./BlockchainDemo'));
const OrderBookDemo = lazy(() => import('./OrderBookDemo'));

const DEMO_MAP: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  'stock-price-chart': StockPriceDemo,
  'compound-growth': CompoundGrowthDemo,
  'blockchain-builder': BlockchainDemo,
  'order-book': OrderBookDemo,
};

export default function DemoRenderer({ demoId }: { demoId: string }) {
  const DemoComponent = DEMO_MAP[demoId];
  if (!DemoComponent) return null;

  return (
    <Suspense fallback={
      <div style={{ background: '#0a0a0a', borderRadius: '1rem', padding: '2rem', border: '1px solid #222', textAlign: 'center', color: '#888' }}>
        Loading interactive demo...
      </div>
    }>
      <div style={{ margin: '1.5rem 0' }}>
        <DemoComponent />
      </div>
    </Suspense>
  );
}
