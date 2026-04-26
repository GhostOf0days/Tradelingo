import { describe, expect, it } from 'vitest';
import { Account } from '../src/models/Account';
import { RetirementCalculator } from '../src/models/RetirementCalculator';

describe('RetirementCalculator', () => {
  it('returns current balance when projection years are zero', () => {
    const account = new Account('ira', 'IRA', 'Test account', 7000, false, 7000, 25000, 0);
    expect(RetirementCalculator.project(account)).toBe(25000);
  });

  it('caps account contributions at the account contribution limit', () => {
    const overLimit = new Account('ira', 'IRA', 'Test account', 7000, false, 70000, 0, 1);
    const atLimit = new Account('ira', 'IRA', 'Test account', 7000, false, 7000, 0, 1);

    expect(RetirementCalculator.project(overLimit)).toBeCloseTo(RetirementCalculator.project(atLimit), 6);
  });

  it('handles negative compound returns without producing negative balances or NaN', () => {
    const result = RetirementCalculator.compound(10000, -50, 10, 12);

    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(10000);
  });

  it('clamps invalid savings inputs to safe values', () => {
    const result = RetirementCalculator.projectSavings(Number.NaN, -500, Number.POSITIVE_INFINITY, -10);

    expect(result).toBe(0);
  });
});
