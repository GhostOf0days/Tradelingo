import { useState } from 'react';
import '../styles/Calculator.css';

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<'retirement' | 'compound' | 'savings'>('retirement');
  const [selectedAccount, setSelectedAccount] = useState<string>('401k');
  const [accountDetails, setAccountDetails] = useState({
    annualContribution: 22500,
    employerMatch: 0,
    currentBalance: 0,
    years: 30,
  });
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

  const calculateCompound = () => {
    const p = parseFloat(compoundData.principal.toString());
    const r = parseFloat(compoundData.annualRate.toString()) / 100;
    const n = parseFloat(compoundData.compoundFreq.toString());
    const t = parseFloat(compoundData.years.toString());
    const amount = p * Math.pow(1 + r / n, n * t);
    return amount.toFixed(2);
  };

  const calculateRetirement = () => {
    const currentAge = parseInt(savingsData.currentAge.toString());
    const retirementAge = parseInt(savingsData.retirementAge.toString());
    const years = retirementAge - currentAge;
    const pv = parseFloat(savingsData.currentSavings.toString());
    const pmt = parseFloat(savingsData.annualContribution.toString());
    const r = parseFloat(savingsData.annualReturn.toString()) / 100;
    
    let futureValue = pv * Math.pow(1 + r, years);
    for (let i = 0; i < years; i++) {
      futureValue += pmt * Math.pow(1 + r, years - i);
    }
    return futureValue.toFixed(2);
  };

  const calculate401k = () => {
    const contribution = parseFloat(accountDetails.annualContribution.toString());
    const match = parseFloat(accountDetails.employerMatch.toString());
    const balance = parseFloat(accountDetails.currentBalance.toString());
    const years = parseFloat(accountDetails.years.toString());
    const totalAnnual = contribution + match;
    const fv = balance + (totalAnnual * years);
    return fv.toFixed(2);
  };

  const retirementAccounts = [
    {
      id: '401k',
      name: '401(k)',
      desc: 'Employer-sponsored plan with employer match',
      limit: '$23,500/year',
      color: '#3b82f6',
    },
    {
      id: 'ira',
      name: 'Traditional IRA',
      desc: 'Tax-deferred individual retirement account',
      limit: '$7,000/year',
      color: '#8b5cf6',
    },
    {
      id: 'roth',
      name: 'Roth IRA',
      desc: 'Tax-free withdrawals in retirement',
      limit: '$7,000/year',
      color: '#ec4899',
    },
    {
      id: 'sep',
      name: 'SEP IRA',
      desc: 'For self-employed individuals',
      limit: '$69,000/year',
      color: '#f59e0b',
    },
  ];

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
              {retirementAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`calculator__account-card ${selectedAccount === account.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAccount(account.id)}
                  style={{ borderLeftColor: account.color }}
                >
                  <h3>{account.name}</h3>
                  <p className="calculator__account-desc">{account.desc}</p>
                  <p className="calculator__account-limit">Annual Limit: {account.limit}</p>
                  {selectedAccount === account.id && (
                    <div className="calculator__account-details">
                      <div className="calculator__input-group">
                        <label>Annual Contribution ($)</label>
                        <input
                          type="number"
                          value={accountDetails.annualContribution}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              annualContribution: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      {account.id === '401k' && (
                        <div className="calculator__input-group">
                          <label>Employer Match ($)</label>
                          <input
                            type="number"
                            value={accountDetails.employerMatch}
                            onChange={(e) =>
                              setAccountDetails({
                                ...accountDetails,
                                employerMatch: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      )}
                      <div className="calculator__input-group">
                        <label>Current Balance ($)</label>
                        <input
                          type="number"
                          value={accountDetails.currentBalance}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              currentBalance: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="calculator__input-group">
                        <label>Years Until Retirement</label>
                        <input
                          type="number"
                          value={accountDetails.years}
                          onChange={(e) =>
                            setAccountDetails({
                              ...accountDetails,
                              years: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="calculator__result">
                        <p>Projected Balance at Retirement:</p>
                        <p className="calculator__result-value">${calculate401k()}</p>
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
                <p className="calculator__result-value">${calculateCompound()}</p>
                <p className="calculator__result-gain">
                  Gain: ${(parseFloat(calculateCompound()) - compoundData.principal).toFixed(2)}
                </p>
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
                    setSavingsData({
                      ...savingsData,
                      annualContribution: parseInt(e.target.value),
                    })
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
                <p className="calculator__result-value">${calculateRetirement()}</p>
                <p className="calculator__result-info">
                  Years until retirement:{' '}
                  {savingsData.retirementAge - savingsData.currentAge}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
