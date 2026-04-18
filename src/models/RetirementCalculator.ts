import { Account } from './Account';

// Pure numeric helpers shared by the Calculator page (FV of annuities, compound growth, formatting).
export class RetirementCalculator {
  /** Thousands separators + two decimals for big dollar amounts in the UI. */
  static format(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /** Future value: current balance grows with lump FV + annuity of annual contributions (+ match). */
  static project(account: Account, annualReturn: number = 7): number {
    const r = annualReturn / 100;
    return (
      account.currentBalance * Math.pow(1 + r, account.years) +
      ((account.annualContribution + account.employerMatch) *
        (Math.pow(1 + r, account.years) - 1)) /
        r
    );
  }

  /** Standard compound-interest formula A = P(1 + r/n)^(nt). */
  static compound(
    principal: number,
    annualRate: number,
    years: number,
    compoundFreq: number,
  ): number {
    const r = annualRate / 100;
    return principal * Math.pow(1 + r / compoundFreq, compoundFreq * years);
  }

  /** Lump sum + end-of-year contributions growing at `annualReturn` (simplified vs monthly loop in UI). */
  static projectSavings(
    currentSavings: number,
    annualContribution: number,
    annualReturn: number,
    years: number,
  ): number {
    const r = annualReturn / 100;
    return (
      currentSavings * Math.pow(1 + r, years) +
      (annualContribution * (1 + r) * (Math.pow(1 + r, years) - 1)) / r
    );
  }
}
