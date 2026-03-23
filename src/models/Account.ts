export class Account {
  id: string;
  name: string;
  desc: string;
  hasEmployerMatch: boolean;
  private _contributionLimit: number;
  private _annualContribution: number;
  private _currentBalance: number;
  private _years: number;
  private _employerMatch: number;

  constructor(
    id: string,
    name: string,
    desc: string,
    contributionLimit: number,
    hasEmployerMatch: boolean = false,
    annualContribution: number = 0,
    currentBalance: number = 0,
    years: number = 30,
    employerMatch: number = 0,
  ) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.hasEmployerMatch = hasEmployerMatch;
    this._contributionLimit = contributionLimit;
    this._annualContribution = annualContribution;
    this._currentBalance = currentBalance;
    this._years = years;
    this._employerMatch = employerMatch;
  }

  get contributionLimit(): number {
    return this._contributionLimit;
  }

  get annualContribution(): number {
    return this._annualContribution;
  }
  set annualContribution(value: number) {
    this._annualContribution = value;
  }

  get currentBalance(): number {
    return this._currentBalance;
  }
  set currentBalance(value: number) {
    this._currentBalance = value;
  }

  get years(): number {
    return this._years;
  }
  set years(value: number) {
    this._years = value;
  }

  get employerMatch(): number {
    return this._employerMatch;
  }
  set employerMatch(value: number) {
    this._employerMatch = value;
  }

  getFormattedLimit(): string {
    return `$${this._contributionLimit.toLocaleString()}/year`;
  }

  copyWith(
    updates: Partial<{
      annualContribution: number;
      currentBalance: number;
      years: number;
      employerMatch: number;
    }>,
  ): Account {
    return new Account(
      this.id,
      this.name,
      this.desc,
      this._contributionLimit,
      this.hasEmployerMatch,
      updates.annualContribution ?? this._annualContribution,
      updates.currentBalance ?? this._currentBalance,
      updates.years ?? this._years,
      updates.employerMatch ?? this._employerMatch,
    );
  }
}
