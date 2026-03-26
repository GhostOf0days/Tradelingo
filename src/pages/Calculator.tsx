import { useState } from 'react';
import '../styles/Calculator.css';
import {Account} from '../models/Account';
import {RetirementCalculator} from '../models/RetirementCalculator';

const ACCOUNT_COLORS: Record<string, string> = {'401k':'#3b82f6', 'ira':'#8b5cf6', 'roth':'#ec4899', 'sep':'#f59e0b'};

const RETIREMENT_ACCOUNTS = [
  new Account('401k', '401(k)', 'Employer-sponsored plan', 23500, true, 23500),
  new Account('ira', 'Traditional IRA', 'Tax-deferred account', 7000, false, 7000),
  new Account('roth', 'Roth IRA', 'Tax-free withdrawals', 7000, false, 7000),
  new Account('sep', 'SEP IRA', 'For self-employed', 69000, false, 15000),
];

// Main Calculator component
export default function Calculator() {
  const [activeTab, setActiveTab] = useState<'retirement' | 'compound' | 'savings'>('retirement');
  const [selectedAccount, setSelectedAccount] = useState<Account>(RETIREMENT_ACCOUNTS[0]);
  const [compoundData, setCompoundData] = useState({
    principal: 10000,
    annualRate: 7,
    years: 20,
    compoundFreq: 12,
  });
  const [savingsData, setSavingsData] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    annualContribution: 10000,
    annualReturn: 7,
  });

  const compoundResult = RetirementCalculator.compound(compoundData.principal, compoundData.annualRate, compoundData.years, compoundData.compoundFreq);

  return (
    <div className="calculator">
      <div className="calculator__header">
        <h1>💰 Investment Calculator</h1>
        <p>Plan your financial future with our interactive tools</p>
      </div>

      <div className="calculator__tabs">
        <button
          className={`calculator__tab ${activeTab === 'retirement' ? 'active' : ''}`}
          onClick={() => setActiveTab('retirement')}
        >
          Retirement Accounts
        </button>
        <button
          className={`calculator__tab ${activeTab === 'compound' ? 'active' : ''}`}
          onClick={() => setActiveTab('compound')}
        >
          Compound Interest
        </button>
        <button
          className={`calculator__tab ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          Retirement Savings
        </button>
      </div>

      <div className="calculator__content">
        {/* Retirement Account Selector */}
        {activeTab === 'retirement' && (
          <div className="calculator__section">
            <h2>Which Retirement Account is Best for You?</h2>
            <div className="calculator__accounts-grid">
              {RETIREMENT_ACCOUNTS.map((account) => (
                <div
                  key={account.id}
                  className={`calculator__account-card ${selectedAccount.id === account.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAccount(account)}
                  style={{ borderLeftColor: ACCOUNT_COLORS[account.id] }}
                >
                  <h3>{account.name}</h3>
                  <p className="calculator__account-desc">{account.desc}</p>
                  <p className="calculator__account-limit">Annual Limit: {account.getFormattedLimit()}</p>
                  {selectedAccount.id === account.id && (
                    <div className="calculator__account-details" onClick={(e) => e.stopPropagation()} >
                      <div className="calculator__input-group">
                        <label>Annual Contribution ($)</label>
                        <input
                          type="number"
                          value={selectedAccount.annualContribution}
                          onChange={(e) =>
                            setSelectedAccount(selectedAccount.copyWith({
                              annualContribution: parseInt(e.target.value),
                            }))
                          }
                        />
                      </div>
                      {account.hasEmployerMatch && (
                        <div className="calculator__input-group">
                          <label>Employer Match ($)</label>
                          <input
                            type="number"
                            value={selectedAccount.employerMatch}
                            onChange={(e) =>
                              setSelectedAccount(selectedAccount.copyWith({
                                employerMatch: parseInt(e.target.value),
                              }))
                            }
                          />
                        </div>
                      )}
                      <div className="calculator__input-group">
                        <label>Current Balance ($)</label>
                        <input
                          type="number"
                          value={selectedAccount.currentBalance}
                          onChange={(e) =>
                            setSelectedAccount(selectedAccount.copyWith({
                              currentBalance: parseInt(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="calculator__input-group">
                        <label>Years Until Retirement</label>
                        <input
                          type="number"
                          value={selectedAccount.years}
                          onChange={(e) =>
                            setSelectedAccount(selectedAccount.copyWith({
                              years: parseInt(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="calculator__result">
                        <p>Projected Balance at Retirement:</p>
                        <p className="calculator__result-value">
                          ${RetirementCalculator.format(RetirementCalculator.project(selectedAccount))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compound Interest Calculator */}
        {activeTab === 'compound' && (
          <div className="calculator__section">
            <h2>Compound Interest Calculator</h2>
            <p className="calculator__description">
              See how your money grows over time with compound interest (the "eighth wonder of the world")
            </p>
            <div className="calculator__form">
              <div className="calculator__input-group">
                <label>Principal Amount ($)</label>
                <input
                  type="number"
                  value={compoundData.principal}
                  onChange={(e) =>
                    setCompoundData({ ...compoundData, principal: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={compoundData.annualRate}
                  onChange={(e) =>
                    setCompoundData({ ...compoundData, annualRate: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Time Period (Years)</label>
                <input
                  type="number"
                  value={compoundData.years}
                  onChange={(e) =>
                    setCompoundData({ ...compoundData, years: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Compound Frequency</label>
                <select
                  value={compoundData.compoundFreq}
                  onChange={(e) =>
                    setCompoundData({ ...compoundData, compoundFreq: parseInt(e.target.value) })
                  }
                >
                  <option value={1}>Annually</option>
                  <option value={2}>Semi-Annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
              <div className="calculator__result">
                <p>Final Amount:</p>
                <p className="calculator__result-value">${RetirementCalculator.format(compoundResult)}</p>
                <p className="calculator__result-gain">Gain: ${RetirementCalculator.format(compoundResult - compoundData.principal)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Retirement Savings Calculator */}
        {activeTab === 'savings' && (
          <div className="calculator__section">
            <h2>Retirement Savings Projection</h2>
            <p className="calculator__description">
              Plan how much you'll have saved by your retirement date
            </p>
            <div className="calculator__form">
              <div className="calculator__input-group">
                <label>Current Age</label>
                <input
                  type="number"
                  value={savingsData.currentAge}
                  onChange={(e) =>
                    setSavingsData({ ...savingsData, currentAge: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Retirement Age</label>
                <input
                  type="number"
                  value={savingsData.retirementAge}
                  onChange={(e) =>
                    setSavingsData({ ...savingsData, retirementAge: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Current Savings ($)</label>
                <input
                  type="number"
                  value={savingsData.currentSavings}
                  onChange={(e) =>
                    setSavingsData({ ...savingsData, currentSavings: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Annual Contribution ($)</label>
                <input
                  type="number"
                  value={savingsData.annualContribution}
                  onChange={(e) =>
                    setSavingsData({ ...savingsData, annualContribution: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__input-group">
                <label>Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={savingsData.annualReturn}
                  onChange={(e) =>
                    setSavingsData({ ...savingsData, annualReturn: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="calculator__result">
                <p>Projected Retirement Savings:</p>
                <p className="calculator__result-value">
                  ${RetirementCalculator.format(RetirementCalculator.projectSavings(savingsData.currentSavings, savingsData.annualContribution, savingsData.annualReturn, savingsData.retirementAge - savingsData.currentAge))}
                </p>
                <p className="calculator__result-info">
                  Years until retirement: {savingsData.retirementAge - savingsData.currentAge}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}