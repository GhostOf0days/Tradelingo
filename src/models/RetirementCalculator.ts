import { Account } from './Account';

export class RetirementCalculator {
  static format(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  static project(account: Account, annualReturn: number = 7): number {
    const r = annualReturn / 100;
    return (
      account.currentBalance * Math.pow(1 + r, account.years) +
      ((account.annualContribution + account.employerMatch) *
        (Math.pow(1 + r, account.years) - 1)) /
        r
    );
  }

  static compound(
    principal: number,
    annualRate: number,
    years: number,
    compoundFreq: number,
  ): number {
    const r = annualRate / 100;
    return principal * Math.pow(1 + r / compoundFreq, compoundFreq * years);
  }

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
