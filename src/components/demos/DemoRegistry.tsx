/**
 * Design Pattern: Bridge Pattern
 *
 * Purpose:
 * Separates lesson content data from interactive demo implementations.
 *
 * How:
 * Lessons store only a string `demo` identifier.
 * This registry maps those identifiers to lazily loaded React components.
 *
 * Benefit:
 * New demos can be added or existing demos changed without modifying
 * lesson content structures. Also supports code-splitting to keep
 * the main bundle small.
 */

// Maps lesson `demo` string ids to lazily loaded interactive widgets so the main bundle stays small.
import { lazy, Suspense } from 'react';

const StockPriceDemo = lazy(() => import('./StockPriceDemo'));
const CompoundGrowthDemo = lazy(() => import('./CompoundGrowthDemo'));
const BlockchainDemo = lazy(() => import('./BlockchainDemo'));
const OrderBookDemo = lazy(() => import('./OrderBookDemo'));
const DiversificationDemo = lazy(() => import('./DiversificationDemo'));
const PortfolioAllocationDemo = lazy(() => import('./PortfolioAllocationDemo'));
const DollarCostAverageDemo = lazy(() => import('./DollarCostAverageDemo'));
const MarginCalculatorDemo = lazy(() => import('./MarginCalculatorDemo'));
const RiskToleranceDemo = lazy(() => import('./RiskToleranceDemo'));

// Bridge implementor mapping: abstraction IDs -> concrete demo components
const DEMO_MAP: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  'stock-price-chart': StockPriceDemo,
  'compound-growth': CompoundGrowthDemo,
  'blockchain-builder': BlockchainDemo,
  'order-book': OrderBookDemo,
  'diversification': DiversificationDemo,
  'portfolio-allocation': PortfolioAllocationDemo,
  'dollar-cost-average': DollarCostAverageDemo,
  'margin-calculator': MarginCalculatorDemo,
  'risk-tolerance': RiskToleranceDemo,
};

/** Resolves a lesson's `demo` string to a lazy component, or renders nothing if unknown. */
export default function DemoRenderer({ demoId }: { demoId: string }) {
  const DemoComponent = DEMO_MAP[demoId];
  if (!DemoComponent) return null;

  return (
    <Suspense fallback={
      <div style={{ background: 'var(--surface)', borderRadius: '1rem', padding: '2rem', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading interactive demo...
      </div>
    }>
      <div style={{ margin: '1.5rem 0' }}>
        <DemoComponent />
      </div>
    </Suspense>
  );
}
