// Editable snapshot of a retirement account type for the calculator (limits, match, horizon).
export default class Account {
  id: string;

  name: string;

  desc: string;

  hasEmployerMatch: boolean;

  private contributionLimitValue: number;

  private annualContributionValue: number;

  private currentBalanceValue: number;

  private yearsValue: number;

  private employerMatchValue: number;

  constructor(
    id: string,
    name: string,
    desc: string,
    contributionLimit: number,
    hasEmployerMatch: boolean = false,
    annualContribution: number = 0,
    currentBalance: number = 0,
    years: number = 30,
    employerMatch: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.hasEmployerMatch = hasEmployerMatch;
    this.contributionLimitValue = contributionLimit;
    this.annualContributionValue = annualContribution;
    this.currentBalanceValue = currentBalance;
    this.yearsValue = years;
    this.employerMatchValue = employerMatch;
  }

  get contributionLimit(): number {
    return this.contributionLimitValue;
  }

  get annualContribution(): number {
    return this.annualContributionValue;
  }

  set annualContribution(value: number) {
    this.annualContributionValue = value;
  }

  get currentBalance(): number {
    return this.currentBalanceValue;
  }

  set currentBalance(value: number) {
    this.currentBalanceValue = value;
  }

  get years(): number {
    return this.yearsValue;
  }

  set years(value: number) {
    this.yearsValue = value;
  }

  get employerMatch(): number {
    return this.employerMatchValue;
  }

  set employerMatch(value: number) {
    this.employerMatchValue = value;
  }

  getFormattedLimit(): string {
    return `$${this.contributionLimitValue.toLocaleString()}/year`;
  }

  copyWith(
    updates: Partial<{
      annualContribution: number;
      currentBalance: number;
      years: number;
      employerMatch: number;
    }>
  ): Account {
    return new Account(
      this.id,
      this.name,
      this.desc,
      this.contributionLimitValue,
      this.hasEmployerMatch,
      updates.annualContribution ?? this.annualContributionValue,
      updates.currentBalance ?? this.currentBalanceValue,
      updates.years ?? this.yearsValue,
      updates.employerMatch ?? this.employerMatchValue
    );
  }
}
