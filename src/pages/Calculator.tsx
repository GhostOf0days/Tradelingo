// Three calculators in one page: retirement account projection, pure compound interest,
// and generic savings-to-retirement. Charts use Recharts; math lives in RetirementCalculator.
import { useState, useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import Account from '../models/Account';
import RetirementCalculator from '../models/RetirementCalculator';
import '../styles/Calculator.css';

const ACCOUNT_COLORS: Record<string, string> = {
  '401k': '#3b82f6',
  ira: '#8b5cf6',
  roth: '#ec4899',
  sep: '#f59e0b',
};

const RETIREMENT_ACCOUNTS = [
  new Account('401k', '401(k)', 'Employer-sponsored plan', 23500, true, 23500),
  new Account('ira', 'Traditional IRA', 'Tax-deferred account', 7000, false, 7000),
  new Account('roth', 'Roth IRA', 'Tax-free withdrawals', 7000, false, 7000),
  new Account('sep', 'SEP IRA', 'For self-employed', 69000, false, 15000),
];
const MIN_RETURN_RATE = -100;
const MAX_RETURN_RATE = 100;

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const parseNumberInput = (value: string | number) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const normalized = value.trim();
  if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.') {
    return 0;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

type NumberInputOptions = {
  allowDecimal?: boolean;
  allowNegative?: boolean;
};

const sanitizeNumberInput = (
  value: string,
  { allowDecimal = true, allowNegative = false }: NumberInputOptions = {}
) => {
  let sanitized = value.replace(/[^\d.-]/g, '');

  if (!allowNegative) {
    sanitized = sanitized.replace(/-/g, '');
  } else {
    sanitized = sanitized.replace(/(?!^)-/g, '');
  }

  if (!allowDecimal) {
    sanitized = sanitized.replace(/\./g, '');
  } else {
    const firstDecimal = sanitized.indexOf('.');
    if (firstDecimal !== -1) {
      sanitized =
        sanitized.slice(0, firstDecimal + 1) + sanitized.slice(firstDecimal + 1).replace(/\./g, '');
    }
  }

  return sanitized;
};

type AccountInputKey = 'annualContribution' | 'currentBalance' | 'years' | 'employerMatch';

const accountToInputs = (account: Account): Record<AccountInputKey, string> => ({
  annualContribution: String(account.annualContribution),
  currentBalance: String(account.currentBalance),
  years: String(account.years),
  employerMatch: String(account.employerMatch),
});

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<'retirement' | 'compound' | 'savings'>('retirement');
  const [selectedAccount, setSelectedAccount] = useState<Account>(RETIREMENT_ACCOUNTS[0]);
  const [accountInputs, setAccountInputs] = useState<Record<AccountInputKey, string>>(() =>
    accountToInputs(RETIREMENT_ACCOUNTS[0])
  );
  const [compoundData, setCompoundData] = useState({
    principal: '10000',
    annualRate: '7',
    years: '20',
    compoundFreq: '12',
  });
  const [savingsData, setSavingsData] = useState({
    currentAge: '30',
    retirementAge: '65',
    currentSavings: '50000',
    annualContribution: '10000',
    annualReturn: '7',
  });

  const safeCompoundData = useMemo(
    () => ({
      principal: clamp(parseNumberInput(compoundData.principal), 0, 1_000_000_000),
      annualRate: clamp(
        parseNumberInput(compoundData.annualRate),
        MIN_RETURN_RATE,
        MAX_RETURN_RATE
      ),
      years: clamp(parseNumberInput(compoundData.years), 0, 100),
      compoundFreq: Math.max(1, Math.floor(parseNumberInput(compoundData.compoundFreq) || 1)),
    }),
    [compoundData.annualRate, compoundData.compoundFreq, compoundData.principal, compoundData.years]
  );

  const compoundResult = RetirementCalculator.compound(
    safeCompoundData.principal,
    safeCompoundData.annualRate,
    safeCompoundData.years,
    safeCompoundData.compoundFreq
  );
  const safeSelectedAccount = selectedAccount.copyWith({
    annualContribution: clamp(
      selectedAccount.annualContribution || 0,
      0,
      selectedAccount.contributionLimit
    ),
    currentBalance: clamp(selectedAccount.currentBalance || 0, 0, 1_000_000_000),
    years: Math.floor(clamp(selectedAccount.years || 0, 0, 100)),
    employerMatch: clamp(selectedAccount.employerMatch || 0, 0, 1_000_000_000),
  });
  const retirementProjection = RetirementCalculator.project(safeSelectedAccount);
  const safeSavingsData = {
    currentAge: Math.floor(clamp(parseNumberInput(savingsData.currentAge), 0, 120)),
    currentSavings: clamp(parseNumberInput(savingsData.currentSavings), 0, 1_000_000_000),
    annualContribution: clamp(parseNumberInput(savingsData.annualContribution), 0, 1_000_000_000),
    annualReturn: clamp(
      parseNumberInput(savingsData.annualReturn),
      MIN_RETURN_RATE,
      MAX_RETURN_RATE
    ),
  };
  const safeRetirementAge = Math.floor(
    clamp(parseNumberInput(savingsData.retirementAge), safeSavingsData.currentAge, 120)
  );
  const savingsYears = safeRetirementAge - safeSavingsData.currentAge;
  const savingsProjection = RetirementCalculator.projectSavings(
    safeSavingsData.currentSavings,
    safeSavingsData.annualContribution,
    safeSavingsData.annualReturn,
    savingsYears
  );

  /** Year-by-year stacked series: money you put in vs growth, for the selected account card. */
  const retirementChartData = useMemo(() => {
    const data = [];
    const safeYears = Math.floor(clamp(selectedAccount.years || 0, 0, 100));
    const annualReturn = 7;
    const r = annualReturn / 100;
    const monthlyRate = r / 12;

    let balance = clamp(selectedAccount.currentBalance || 0, 0, 1_000_000_000);
    const employeeContribution = clamp(
      selectedAccount.annualContribution || 0,
      0,
      selectedAccount.contributionLimit
    );
    const annualContribution =
      employeeContribution + clamp(selectedAccount.employerMatch || 0, 0, 1_000_000_000);
    const monthlyContribution = annualContribution / 12;

    for (let year = 0; year <= safeYears; year += 1) {
      const totalContributed =
        clamp(selectedAccount.currentBalance || 0, 0, 1_000_000_000) + annualContribution * year;
      const growth = Math.max(0, balance - totalContributed);

      data.push({
        year: `Year ${year}`,
        contributed: Math.round(totalContributed),
        growth: Math.round(growth),
        total: Math.round(balance),
      });

      for (let m = 0; m < 12; m += 1) {
        balance = (balance + monthlyContribution) * (1 + monthlyRate);
      }
    }
    return data;
  }, [selectedAccount]);

  /** Principal vs interest earned each year under the compound-interest form inputs. */
  const compoundChartData = useMemo(() => {
    const data = [];
    const r = safeCompoundData.annualRate / 100;
    const n = safeCompoundData.compoundFreq;
    const safeYears = Math.max(0, Math.min(100, safeCompoundData.years));

    for (let year = 0; year <= safeYears; year += 1) {
      const amount = safeCompoundData.principal * (1 + r / n) ** (n * year);
      const { principal } = safeCompoundData;
      const interest = amount - principal;

      data.push({
        year: `Year ${year}`,
        principal: Math.round(principal),
        interest: Math.round(interest),
        total: Math.round(amount),
      });
    }
    return data;
  }, [safeCompoundData]);

  /** Age-based projection with recurring contributions until retirement age. */
  const savingsChartData = useMemo(() => {
    const data = [];
    const safeCurrentAge = Math.floor(clamp(parseNumberInput(savingsData.currentAge), 0, 120));
    const projectedRetirementAge = Math.floor(
      clamp(parseNumberInput(savingsData.retirementAge), safeCurrentAge, 120)
    );
    const years = projectedRetirementAge - safeCurrentAge;
    const r =
      clamp(parseNumberInput(savingsData.annualReturn), MIN_RETURN_RATE, MAX_RETURN_RATE) / 100;
    const monthlyRate = r / 12;

    const safeCurrentSavings = clamp(
      parseNumberInput(savingsData.currentSavings),
      0,
      1_000_000_000
    );
    let balance = safeCurrentSavings;
    const safeAnnualContribution = clamp(
      parseNumberInput(savingsData.annualContribution),
      0,
      1_000_000_000
    );
    const monthlyContribution = safeAnnualContribution / 12;

    for (let year = 0; year <= years; year += 1) {
      const totalContributed = safeCurrentSavings + safeAnnualContribution * year;
      const growth = balance - totalContributed;

      data.push({
        age: safeCurrentAge + year,
        contributed: Math.round(totalContributed),
        growth: Math.round(growth),
        total: Math.round(balance),
      });

      for (let m = 0; m < 12; m += 1) {
        balance = (balance + monthlyContribution) * (1 + monthlyRate);
      }
    }
    return data;
  }, [savingsData]);

  /** Shared by Recharts tooltips so ticks and hover values match. */
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const handleSelectAccount = (account: Account) => {
    if (account.id === selectedAccount.id) return;
    setSelectedAccount(account);
    setAccountInputs(accountToInputs(account));
  };

  const updateSelectedAccountInput = (
    field: AccountInputKey,
    value: string,
    max: number,
    options: NumberInputOptions & { integer?: boolean } = {}
  ) => {
    const sanitized = sanitizeNumberInput(value, options);
    const parsed = clamp(parseNumberInput(sanitized), 0, max);
    const numericValue = options.integer ? Math.floor(parsed) : parsed;

    setAccountInputs((prev) => ({ ...prev, [field]: sanitized }));
    setSelectedAccount((prev) =>
      prev.copyWith({
        [field]: numericValue,
      } as Partial<{
        annualContribution: number;
        currentBalance: number;
        years: number;
        employerMatch: number;
      }>)
    );
  };

  return (
    <div className="calculator">
      <div className="calculator__header">
        <h1>Investment Calculator</h1>
        <p>Plan your financial future with our interactive tools</p>
      </div>

      <div className="calculator__tabs">
        <button
          type="button"
          className={`calculator__tab ${activeTab === 'retirement' ? 'active' : ''}`}
          onClick={() => setActiveTab('retirement')}
        >
          Retirement Accounts
        </button>
        <button
          type="button"
          className={`calculator__tab ${activeTab === 'compound' ? 'active' : ''}`}
          onClick={() => setActiveTab('compound')}
        >
          Compound Interest
        </button>
        <button
          type="button"
          className={`calculator__tab ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          Retirement Savings
        </button>
      </div>

      <div className="calculator__content">
        {activeTab === 'retirement' && (
          <div className="calculator__section">
            <h2>Which Retirement Account is Best for You?</h2>
            <div className="calculator__accounts-grid">
              {RETIREMENT_ACCOUNTS.map((account) => (
                <div
                  key={account.id}
                  role="button"
                  tabIndex={0}
                  className={`calculator__account-card ${selectedAccount.id === account.id ? 'selected' : ''}`}
                  onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest('input, select, button, textarea, a')) return;
                    handleSelectAccount(account);
                  }}
                  onKeyDown={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest('input, select, button, textarea, a')) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleSelectAccount(account);
                    }
                  }}
                  style={{ borderLeftColor: ACCOUNT_COLORS[account.id] }}
                >
                  <h3>{account.name}</h3>
                  <p className="calculator__account-desc">{account.desc}</p>
                  <p className="calculator__account-limit">
                    Annual Limit: {account.getFormattedLimit()}
                  </p>
                  {selectedAccount.id === account.id && (
                    <div className="calculator__account-details">
                      <div className="calculator__input-group">
                        <label htmlFor={`account-${account.id}-annual-contribution`}>
                          Annual Contribution ($)
                          <input
                            id={`account-${account.id}-annual-contribution`}
                            type="text"
                            inputMode="decimal"
                            value={accountInputs.annualContribution}
                            onChange={(e) =>
                              updateSelectedAccountInput(
                                'annualContribution',
                                e.target.value,
                                selectedAccount.contributionLimit
                              )
                            }
                          />
                        </label>
                      </div>
                      {account.hasEmployerMatch && (
                        <div className="calculator__input-group">
                          <label htmlFor={`account-${account.id}-employer-match`}>
                            Employer Match ($)
                            <input
                              id={`account-${account.id}-employer-match`}
                              type="text"
                              inputMode="decimal"
                              value={accountInputs.employerMatch}
                              onChange={(e) =>
                                updateSelectedAccountInput(
                                  'employerMatch',
                                  e.target.value,
                                  1_000_000_000
                                )
                              }
                            />
                          </label>
                        </div>
                      )}
                      <div className="calculator__input-group">
                        <label htmlFor={`account-${account.id}-current-balance`}>
                          Current Balance ($)
                          <input
                            id={`account-${account.id}-current-balance`}
                            type="text"
                            inputMode="decimal"
                            value={accountInputs.currentBalance}
                            onChange={(e) =>
                              updateSelectedAccountInput(
                                'currentBalance',
                                e.target.value,
                                1_000_000_000
                              )
                            }
                          />
                        </label>
                      </div>
                      <div className="calculator__input-group">
                        <label htmlFor={`account-${account.id}-years`}>
                          Years Until Retirement
                          <input
                            id={`account-${account.id}-years`}
                            type="text"
                            inputMode="numeric"
                            value={accountInputs.years}
                            onChange={(e) =>
                              updateSelectedAccountInput('years', e.target.value, 100, {
                                allowDecimal: false,
                                integer: true,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="calculator__result">
                        <p>Projected Balance at Retirement:</p>
                        <p className="calculator__result-value">
                          ${RetirementCalculator.format(retirementProjection)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="calculator__chart-container">
              <h3>Growth Projection</h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={retirementChartData}>
                    <defs>
                      <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={ACCOUNT_COLORS[selectedAccount.id]}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={ACCOUNT_COLORS[selectedAccount.id]}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="year" stroke="var(--text-muted)" />
                    <YAxis
                      tickFormatter={(value) => `$${value / 1000}k`}
                      stroke="var(--text-muted)"
                    />
                    <Tooltip
                      formatter={(value: unknown) => [formatCurrency(Number(value ?? 0)), '']}
                      contentStyle={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                      labelStyle={{ color: 'var(--text-muted)' }}
                    />
                    <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
                    <Area
                      type="monotone"
                      dataKey="contributed"
                      stackId="1"
                      stroke={ACCOUNT_COLORS[selectedAccount.id]}
                      fillOpacity={1}
                      fill="url(#colorContributed)"
                      name="Total Contributed"
                    />
                    <Area
                      type="monotone"
                      dataKey="growth"
                      stackId="1"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorGrowth)"
                      name="Investment Growth"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compound' && (
          <div className="calculator__section">
            <h2>Compound Interest Calculator</h2>
            <p className="calculator__description">
              See how your money grows over time with compound interest (the &quot;eighth wonder of
              the world&quot;)
            </p>
            <div className="calculator__grid-layout">
              <div className="calculator__form">
                <div className="calculator__input-group">
                  <label htmlFor="compound-principal">
                    Principal Amount ($)
                    <input
                      id="compound-principal"
                      type="text"
                      inputMode="decimal"
                      value={compoundData.principal}
                      onChange={(e) =>
                        setCompoundData({
                          ...compoundData,
                          principal: sanitizeNumberInput(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="compound-annual-rate">
                    Annual Interest Rate (%)
                    <input
                      id="compound-annual-rate"
                      type="text"
                      inputMode="decimal"
                      value={compoundData.annualRate}
                      onChange={(e) =>
                        setCompoundData({
                          ...compoundData,
                          annualRate: sanitizeNumberInput(e.target.value, { allowNegative: true }),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="compound-years">
                    Time Period (Years)
                    <input
                      id="compound-years"
                      type="text"
                      inputMode="numeric"
                      value={compoundData.years}
                      onChange={(e) =>
                        setCompoundData({
                          ...compoundData,
                          years: sanitizeNumberInput(e.target.value, { allowDecimal: false }),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="compound-frequency">
                    Compound Frequency
                    <select
                      id="compound-frequency"
                      value={compoundData.compoundFreq}
                      onChange={(e) =>
                        setCompoundData({ ...compoundData, compoundFreq: e.target.value })
                      }
                    >
                      <option value={1}>Annually</option>
                      <option value={2}>Semi-Annually</option>
                      <option value={4}>Quarterly</option>
                      <option value={12}>Monthly</option>
                      <option value={365}>Daily</option>
                    </select>
                  </label>
                </div>
                <div className="calculator__result">
                  <p>Final Amount:</p>
                  <p className="calculator__result-value">
                    ${RetirementCalculator.format(compoundResult)}
                  </p>
                  <p className="calculator__result-gain">
                    Gain/Loss: $
                    {RetirementCalculator.format(compoundResult - safeCompoundData.principal)}
                  </p>
                </div>
              </div>

              <div className="calculator__chart-container">
                <h3>Growth Over Time</h3>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <AreaChart data={compoundChartData}>
                      <defs>
                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis dataKey="year" stroke="var(--text-muted)" />
                      <YAxis
                        tickFormatter={(value) => `$${value / 1000}k`}
                        stroke="var(--text-muted)"
                      />
                      <Tooltip
                        formatter={(value: unknown) => [formatCurrency(Number(value ?? 0)), '']}
                        contentStyle={{
                          backgroundColor: 'var(--card-bg)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        labelStyle={{ color: 'var(--text-muted)' }}
                      />
                      <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
                      <Area
                        type="monotone"
                        dataKey="principal"
                        stackId="1"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorPrincipal)"
                        name="Principal"
                      />
                      <Area
                        type="monotone"
                        dataKey="interest"
                        stackId="1"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorInterest)"
                        name="Interest Earned"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="calculator__section">
            <h2>Retirement Savings Projection</h2>
            <p className="calculator__description">
              Plan how much you&apos;ll have saved by your retirement date
            </p>
            <div className="calculator__grid-layout">
              <div className="calculator__form">
                <div className="calculator__input-group">
                  <label htmlFor="savings-current-age">
                    Current Age
                    <input
                      id="savings-current-age"
                      type="text"
                      inputMode="numeric"
                      value={savingsData.currentAge}
                      onChange={(e) =>
                        setSavingsData({
                          ...savingsData,
                          currentAge: sanitizeNumberInput(e.target.value, { allowDecimal: false }),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="savings-retirement-age">
                    Retirement Age
                    <input
                      id="savings-retirement-age"
                      type="text"
                      inputMode="numeric"
                      value={savingsData.retirementAge}
                      onChange={(e) =>
                        setSavingsData({
                          ...savingsData,
                          retirementAge: sanitizeNumberInput(e.target.value, {
                            allowDecimal: false,
                          }),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="savings-current-savings">
                    Current Savings ($)
                    <input
                      id="savings-current-savings"
                      type="text"
                      inputMode="decimal"
                      value={savingsData.currentSavings}
                      onChange={(e) =>
                        setSavingsData({
                          ...savingsData,
                          currentSavings: sanitizeNumberInput(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="savings-annual-contribution">
                    Annual Contribution ($)
                    <input
                      id="savings-annual-contribution"
                      type="text"
                      inputMode="decimal"
                      value={savingsData.annualContribution}
                      onChange={(e) =>
                        setSavingsData({
                          ...savingsData,
                          annualContribution: sanitizeNumberInput(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__input-group">
                  <label htmlFor="savings-annual-return">
                    Expected Annual Return (%)
                    <input
                      id="savings-annual-return"
                      type="text"
                      inputMode="decimal"
                      value={savingsData.annualReturn}
                      onChange={(e) =>
                        setSavingsData({
                          ...savingsData,
                          annualReturn: sanitizeNumberInput(e.target.value, {
                            allowNegative: true,
                          }),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="calculator__result">
                  <p>Projected Retirement Savings:</p>
                  <p className="calculator__result-value">
                    ${RetirementCalculator.format(savingsProjection)}
                  </p>
                  <p className="calculator__result-info">Years until retirement: {savingsYears}</p>
                </div>
              </div>

              <div className="calculator__chart-container">
                <h3>Savings Growth to Retirement</h3>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <AreaChart data={savingsChartData}>
                      <defs>
                        <linearGradient id="colorContributedSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGrowthSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="age"
                        stroke="var(--text-muted)"
                        label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value / 1000}k`}
                        stroke="var(--text-muted)"
                      />
                      <Tooltip
                        formatter={(value: unknown) => [formatCurrency(Number(value ?? 0)), '']}
                        contentStyle={{
                          backgroundColor: 'var(--card-bg)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        labelStyle={{ color: 'var(--text-muted)' }}
                      />
                      <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
                      <Area
                        type="monotone"
                        dataKey="contributed"
                        stackId="1"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorContributedSavings)"
                        name="Total Contributed"
                      />
                      <Area
                        type="monotone"
                        dataKey="growth"
                        stackId="1"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorGrowthSavings)"
                        name="Investment Growth"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
