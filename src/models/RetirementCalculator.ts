/**
 * Design Pattern: Strategy Pattern
 *
 * Purpose:
 * Provides interchangeable financial projection algorithms
 * without coupling the Calculator UI to any one formula.
 *
 * How:
 * RetirementCalculator exposes three static methods — project,
 * compound, and projectSavings — each encapsulating a different
 * financial formula. The Calculator page selects which to invoke
 * based on the active Account type.
 *
 * Benefit:
 * New projection strategies (e.g. inflation-adjusted returns)
 * can be added as additional static methods without changing
 * the calling component or the Account data structure.
 */

import { Account } from './Account';

// Pure numeric helpers shared by the Calculator page (FV of annuities, compound growth, formatting).
export class RetirementCalculator {
  private static readonly MAX_MONEY = 1_000_000_000;
  private static readonly MAX_YEARS = 100;
  private static readonly MIN_RATE = -100;
  private static readonly MAX_RATE = 100;
  private static readonly MAX_COMPOUND_FREQUENCY = 365;

  private static clamp(value: number, min: number, max: number = Number.MAX_SAFE_INTEGER): number {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  private static safeRate(annualRate: number): number {
    return this.clamp(annualRate, this.MIN_RATE, this.MAX_RATE) / 100;
  }

  private static projectMonthly(
    currentBalance: number,
    annualContribution: number,
    annualReturn: number,
    years: number
  ): number {
    const safeCurrentBalance = this.clamp(currentBalance, 0, this.MAX_MONEY);
    const safeAnnualContribution = this.clamp(annualContribution, 0, this.MAX_MONEY);
    const safeYears = Math.floor(this.clamp(years, 0, this.MAX_YEARS));
    const monthlyRate = this.safeRate(annualReturn) / 12;

    if (safeYears === 0) return safeCurrentBalance;
    if (monthlyRate === 0) return safeCurrentBalance + safeAnnualContribution * safeYears;

    let balance = safeCurrentBalance;
    const monthlyContribution = safeAnnualContribution / 12;
    const monthCount = safeYears * 12;

    for (let month = 0; month < monthCount; month += 1) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate);
    }

    return Number.isFinite(balance) ? Math.max(0, balance) : 0;
  }

  /** Thousands separators + two decimals for big dollar amounts in the UI. */
  static format(value: number): string {
    const safeValue = Number.isFinite(value) ? value : 0;
    return safeValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /** Future value: current balance grows with lump FV + annuity of annual contributions (+ match). */
  static project(account: Account, annualReturn: number = 7): number {
    const employeeContribution = this.clamp(account.annualContribution, 0, account.contributionLimit);
    const employerMatch = this.clamp(account.employerMatch, 0, this.MAX_MONEY);
    const annualContribution = employeeContribution + employerMatch;
    return this.projectMonthly(account.currentBalance, annualContribution, annualReturn, account.years);
  }

  /** Standard compound-interest formula A = P(1 + r/n)^(nt). */
  static compound(
    principal: number,
    annualRate: number,
    years: number,
    compoundFreq: number,
  ): number {
    const safePrincipal = this.clamp(principal, 0, this.MAX_MONEY);
    const safeYears = this.clamp(years, 0, this.MAX_YEARS);
    const safeCompoundFreq = Math.max(
      1,
      Math.floor(this.clamp(compoundFreq, 1, this.MAX_COMPOUND_FREQUENCY))
    );
    const r = this.safeRate(annualRate);

    if (safeYears === 0 || r === 0) return safePrincipal;
    const amount = safePrincipal * Math.pow(1 + r / safeCompoundFreq, safeCompoundFreq * safeYears);
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
  }

  /** Lump sum + annual contributions growing at `annualReturn`. */
  static projectSavings(
    currentSavings: number,
    annualContribution: number,
    annualReturn: number,
    years: number,
  ): number {
    return this.projectMonthly(currentSavings, annualContribution, annualReturn, years);
  }
}
