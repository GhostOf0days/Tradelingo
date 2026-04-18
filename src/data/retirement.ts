// Module 2: retirement accounts, compounding, withdrawal mindset (paired lessons + pretest below).
export const RETIREMENT_PRETEST = [
  { question: "What is a 401(k)?", options: ["A type of savings account", "An employer-sponsored retirement plan with tax advantages", "A government pension", "A type of stock"], correctIndex: 1 },
  { question: "What does an IRA stand for?", options: ["Individual Retirement Account", "International Revenue Administration", "Institutional Risk Assessment", "Investment Rate Agreement"], correctIndex: 0 },
  { question: "What is the advantage of a Roth IRA?", options: ["Higher contribution limits", "Tax-free withdrawals in retirement", "Government contributions match", "Immediate cash back"], correctIndex: 1 },
  { question: "What is a Traditional IRA?", options: ["An IRA started before 1950", "An account where contributions are tax-deductible now but taxed in retirement", "Only available to government employees", "A type of savings bond"], correctIndex: 1 },
  { question: "What is employer matching in a 401(k)?", options: ["When employer steals your money", "Free money employers contribute if you contribute to your 401(k)", "A requirement to work longer", "Bonus commission"], correctIndex: 1 },
  { question: "At what age can you withdraw from an IRA without penalties?", options: ["50", "55", "59.5", "65"], correctIndex: 2 },
  { question: "What is the annual contribution limit for a 401(k) in 2024?", options: ["$15,500", "$20,500", "$25,500", "$30,000"], correctIndex: 1 },
  { question: "What is Required Minimum Distribution (RMD)?", options: ["Minimum you must save each month", "Mandatory withdrawal from retirement accounts after age 73", "A monthly insurance fee", "The amount to retire comfortably"], correctIndex: 1 },
  { question: "What is Social Security?", options: ["A security guard service", "A government program providing income for retired, disabled, and surviving workers", "A bank service", "A type of investment"], correctIndex: 1 },
  { question: "What is the primary goal of retirement planning?", options: ["To work less", "To have enough income to maintain your lifestyle when you stop working", "To retire as early as possible", "To maximize taxes"], correctIndex: 1 },
  { question: "What is the 4% rule in retirement?", options: ["Spend 4% of your paycheck", "Withdraw 4% of your retirement portfolio in year 1, then adjust for inflation", "Work 4% of the year", "Invest 4% in bonds"], correctIndex: 1 },
  { question: "What is pension?", options: ["A type of punishment", "Regular payments made by an employer to an employee after retirement", "A government tax", "Life insurance"], correctIndex: 1 }
];

export const RETIREMENT_LESSONS = [
  {
    title: "Lesson 1: Why Retire?",
    content: `Retirement is one of life's most important financial goals. It's the period when you stop working full-time and live off your savings, investments, and/or government benefits.

Why retirement matters:
• Freedom: You control your time and can pursue hobbies, travel, spend time with family
• Longevity: People today live 25-30 years in retirement (from age 65-95)
• Financial security: Without a plan, you might run out of money

The challenge: Social Security alone isn't enough. The average Social Security benefit in 2024 is only $1,800/month - that's $21,600/year. For comfortable retirement, most people need 70-80% of their pre-retirement income.

Example: If you earn $50,000/year now, you might need $35,000-40,000/year in retirement to maintain your lifestyle.

Three sources of retirement income:
1. Social Security (government program)
2. Pensions (employer payments)
3. Personal savings and investments (401k, IRA, brokerage accounts)

Starting early matters because of compound interest. Someone who starts saving at 25 can retire comfortably with modest contributions. Someone starting at 45 needs to save much more aggressively.`,
    question: RETIREMENT_PRETEST[0],
    demo: 'compound-growth'
  },
  {
    title: "Lesson 2: 401(k) Plans Basics",
    content: `A 401(k) is an employer-sponsored retirement savings plan where you contribute a portion of your salary before taxes are taken out. It's one of the most powerful retirement tools available.

How 401(k) works:
1. You decide to contribute, say, $500/month to your 401(k)
2. That $500 comes out of your paycheck BEFORE income taxes
3. Money is invested in stocks, bonds, or funds you choose
4. You don't pay taxes on this money until you withdraw it in retirement
5. Your employer may match your contributions (free money!)

Example: You earn $5,000/month
• Without 401(k): You pay taxes on $5,000, take home ~$3,800
• With 401(k): Contribute $500, pay taxes on $4,500, take home ~$3,400, but have $500 growing tax-free

Employer matching is crucial:
Many employers will match your contributions dollar-for-dollar up to 3-6% of your salary. This is FREE MONEY.

Example: You earn $50,000/year. Employer matches 100% up to 3%.
• 3% of $50,000 = $1,500
• If you contribute $1,500, your employer adds $1,500
• That's an instant 100% return before the market even moves!

Not taking advantage of employer matching is leaving free money on the table.

2024 limits: You can contribute up to $23,500/year to a traditional 401(k).`,
    question: RETIREMENT_PRETEST[1]
  },
  {
    title: "Lesson 3: Traditional vs Roth 401(k)",
    content: `There are two main types of 401(k)s, and they work opposite to each other:

Traditional 401(k):
• Contributions: Tax-deductible NOW (reduces your taxable income today)
• Growth: Tax-free while in the account
• Withdrawals: Taxed as ordinary income (you pay taxes when you take the money out)
• Best for: People in high tax brackets now who expect to be in lower brackets in retirement

Roth 401(k):
• Contributions: Made with after-tax dollars (no tax break today)
• Growth: Tax-free while in the account
• Withdrawals: Tax-free in retirement (no taxes!)
• Best for: Young people, those expecting higher future income/tax rates

Which should you choose?

Choose Traditional if:
- You're in a high tax bracket now (30%+ marginal rate)
- You expect to be in a lower bracket in retirement
- You need to reduce your taxable income today

Choose Roth if:
- You're early in your career earning less now
- You expect to earn more (and pay higher taxes) in the future
- You want guaranteed tax-free withdrawals in retirement
- You want more flexibility (can withdraw contributions anytime)

Key advantage of Roth for young people: You contribute $20,000 now, it grows to $200,000 by retirement. You pay ZERO taxes on that $180,000 gain. That's enormous!`,
    question: RETIREMENT_PRETEST[2]
  },
  {
    title: "Lesson 4: IRA Accounts",
    content: `An IRA (Individual Retirement Account) is a retirement savings account you open yourself, not through an employer. You have more flexibility with IRAs compared to 401(k)s.

Types of IRAs:

Traditional IRA:
• Contributions: Tax-deductible (if income below phase-out limits)
• Withdrawals: Taxed as ordinary income
• Annual limit: $7,000/year ($8,000 if age 50+)
• Required Minimum Distributions (RMD): Must start withdrawing at age 73

Roth IRA:
• Contributions: Not tax-deductible (after-tax dollars)
• Withdrawals: Completely tax-free
• Annual limit: $7,000/year ($8,000 if age 50+)
• No Required Minimum Distributions
• Can withdraw contributions anytime without penalty
• Income limits: Phase out at higher income levels

Key differences from 401(k):
• IRAs have lower contribution limits ($7,000 vs $23,500)
• IRAs have more investment flexibility (can invest in individual stocks)
• 401(k)s often have employer matching (IRAs don't)
• Roth IRA withdrawals are tax-free (huge advantage)

IRA withdrawal penalties:
• Before age 59.5: Generally 10% penalty + income taxes (with exceptions for education, first home, hardship)
• After age 73: Must take Required Minimum Distributions or face 25% penalty

Strategy: Maximize 401(k) for employer match, then max out Roth IRA ($7,000), then save more in 401(k) or taxable brokerage.`,
    question: RETIREMENT_PRETEST[3]
  },
  {
    title: "Lesson 5: Employer Matching",
    content: `Employer matching is the most underutilized benefit in corporate America. It's free money you should never leave on the table.

How matching works:
Employer says: "We'll match 100% of your contributions up to 3% of your salary"

Translation: If you earn $60,000/year and contribute 3%, you contribute $1,800. Employer contributes another $1,800.

Common matching formulas:
• 100% match up to 3%: Contribute $1,800, get $1,800 free (most common)
• 50% match up to 6%: Contribute $3,600, get $1,800 free
• 100% match up to 5%: Contribute $2,500, get $2,500 free

Scenario example:
You earn $50,000. Your employer matches 100% up to 3%.

If you contribute 0%: You get $0 match. You're leaving $1,500/year free money!
If you contribute 3%: You get $1,500 match. Instant 100% return!
If you contribute 6%: You still only get $1,500 match. Extra 3% doesn't get matched.

The critical point: Contribute at least enough to get the full employer match. That's the minimum. After that, you can decide if you want to contribute more.

Vesting schedules: Some employers have vesting schedules, meaning you don't own the match immediately. You have to work there for 1-5 years to own it fully. Always check your employer's vesting schedule!

Pro tip: If you change jobs, maximize your 401(k) before leaving. Some employers stop contributions if you leave.`,
    question: RETIREMENT_PRETEST[4]
  },
  {
    title: "Lesson 6: Early Withdrawals & Penalties",
    content: `One of the most important rules of retirement accounts is understanding the penalties for early withdrawals.

Standard withdrawal age: 59.5
If you withdraw before 59.5, you face:
• 10% early withdrawal penalty (goes to IRS)
• Income taxes on the full amount
• Total loss could be 20-40% of your withdrawal

Example: You withdraw $10,000 from a 401(k) at age 35
• 10% penalty: $1,000
• If in 24% tax bracket: $2,400 in taxes
• Total penalty & taxes: $3,400
• You actually get: $6,600

That's devastating to your long-term growth!

Exceptions to the 10% penalty (still owe income taxes):
1. Rule 72(t): Substantially equal periodic payments (specific formula)
2. Disability
3. Medical expenses exceeding 7.5% of gross income
4. First-time home purchase (up to $10,000 lifetime)
5. Education expenses
6. Birth or adoption expenses (up to $35,000 per person)
7. Hardship distributions (varies by plan)

Roth IRA advantage: You can withdraw contributions (not earnings) anytime without penalty or taxes. The money you put in is yours.

Required Minimum Distributions (RMD):
After age 73, you must start withdrawing from Traditional 401(k)s and IRAs. The IRS calculates minimums based on your life expectancy.

Example: At age 73, if your account has $500,000, you might have to withdraw $18,000-20,000 that year.

Strategy: Plan withdrawals carefully in retirement to minimize taxes and penalties.`,
    question: RETIREMENT_PRETEST[5]
  },
  {
    title: "Lesson 7: Retirement Savings Goals",
    content: `How much money do you need to retire? This is the central question in retirement planning.

The 4% rule: A widely used guideline suggests you can safely withdraw 4% of your portfolio annually in retirement, adjusted for inflation.

Example: If you need $50,000/year to live on:
$50,000 ÷ 0.04 = $1,250,000 needed

If you need $40,000/year:
$40,000 ÷ 0.04 = $1,000,000 needed

The 25x rule: Multiply your annual expenses by 25 to get your target retirement number.
• $30,000 expenses × 25 = $750,000
• $50,000 expenses × 25 = $1,250,000
• $70,000 expenses × 25 = $1,750,000

How much to save per month:
If you're 30 and want to retire at 65, you have 35 years.
Assuming 7% average returns:
• To have $1M: Save $850/month
• To have $2M: Save $1,700/month
• To have $500K: Save $425/month

If you're 40 and want to retire at 65, you have 25 years:
• To have $1M: Save $1,540/month
• To have $2M: Save $3,080/month

Starting early is critical because compound interest does most of the work. Starting at 30 requires $850/month. Starting at 40 requires $1,540/month for the same result.

Key variables:
• How much you save monthly
• Your investment returns (historically 7-10% for stocks)
• How long you invest (time horizon)
• How much you need in retirement`,
    question: RETIREMENT_PRETEST[6],
    demo: 'compound-growth'
  },
  {
    title: "Lesson 8: Social Security Basics",
    content: `Social Security is a government program that provides income to retirees, disabled workers, and survivors of deceased workers. It's a safety net, not a complete retirement solution.

How Social Security works:
Every paycheck, Social Security taxes are withheld (6.2% from you, 6.2% from employer if self-employed you pay 12.4%). This money goes to a trust fund that pays current beneficiaries.

How benefits are calculated:
The government looks at your 35 highest-earning years, calculates your average monthly income, and pays you a percentage based on the formula. Generally:
• Average earner: $1,800-2,000/month ($21,600-24,000/year)
• High earner: $3,000-3,500/month
• Maximum benefit (2024): $3,822/month

Claiming age matters:
• Claim at 62: Full benefits reduced by ~30%
• Claim at 67: Full retirement age for people born 1960+
• Claim at 70: Benefits increased by 24% (maximum)

Example earnings:
Age 62: $2,000/month = $24,000/year
Age 67: $2,800/month = $33,600/year (35% more!)
Age 70: $3,500/month = $42,000/year (75% more!)

If you live to 80+, waiting to claim pays off significantly.

The reality: Social Security is designed to replace 40% of your pre-retirement income, not 100%. You need other sources.

Benefit for retirement planning: Don't count on more than 30-40% of your current income from Social Security. Plan for the rest through personal savings.`,
    question: RETIREMENT_PRETEST[7]
  },
  {
    title: "Lesson 9: Tax-Advantaged Strategies",
    content: `Taxes are one of the biggest expenses in retirement. Strategic planning can save you thousands.

Contribution prioritization:
1. Max employer match first (free money!)
2. Max Roth IRA ($7,000)
3. Max 401(k) beyond employer match
4. Taxable brokerage accounts

Mega backdoor Roth (for high earners):
If your employer allows it, you can contribute extra money to your 401(k) as after-tax contributions and convert to Roth. Contribution limit: Up to $69,000/year (2024).

Tax brackets in retirement:
In retirement, your income comes from:
• Social Security (up to 85% taxable)
• Traditional IRA/401(k) withdrawals (100% taxable)
• Capital gains (15-20% tax if long-term)
• Roth withdrawals (0% tax)

Strategic withdrawal order:
- Year 1: Take from taxable accounts first
- Year 2-10: Take from Traditional accounts
- Year 11+: Let Roth grow, withdraw at end

This minimizes your tax bracket and maximizes growth.

Tax-loss harvesting:
In taxable accounts, sell losing positions to offset gains, reducing taxes. You can deduct up to $3,000 of losses against other income.

State income tax: Some states have no income tax (Florida, Texas, Nevada). Retiring there can save significant taxes!`,
    question: RETIREMENT_PRETEST[8]
  },
  {
    title: "Lesson 10: Healthcare & Long-Term Care",
    content: `Healthcare costs are often underestimated in retirement planning. The average 65-year-old today will spend $315,000 on healthcare in retirement!

Medicare (age 65+):
• Part A: Hospital insurance (mostly free)
• Part B: Doctor visits (~$175/month in 2024)
• Part D: Prescription drugs (~$30-100/month)
• Medigap: Supplement insurance (~$150-300/month)

Total monthly: $400-700/month for typical coverage

Healthcare before 65:
If retiring before Medicare, you need health insurance. Options:
• COBRA from employer (expensive, only 18 months)
• ACA marketplace (subsidized if low income)
• Spouse's plan
• Healthcare sharing ministries
• Part-time work for benefits

Long-term care (nursing home, assisted living):
Many people underestimate this cost. Assisted living costs $50,000-60,000/year. Nursing home care costs $100,000-150,000+/year.

Long-term care insurance:
• Monthly premium: $150-400 depending on age
• Covers nursing care, assisted living, home care
• Essential if you want to protect your assets
• Buy young (50s) before health issues

The strategy: Budget $400-700/month for Medicare, $150-300/month for supplement, and consider long-term care insurance to protect your nest egg.`,
    question: RETIREMENT_PRETEST[9]
  },
  {
    title: "Lesson 11: Retirement Lifestyle Planning",
    content: `Retirement isn't just about money – it's about how you want to live. Different retirement styles require different amounts of savings.

Three retirement lifestyles:

Lean retirement ($30,000-40,000/year):
• Modest home, minimal travel
• Local activities, simple entertainment
• Suits retirees who downsize significantly
• Needs: ~$750K-$1M (using 4% rule)

Comfortable retirement ($50,000-70,000/year):
• Nice home, regular vacations
• Hobbies, restaurants, entertainment
• Most people aim for this
• Needs: ~$1.25M-$1.75M

Luxury retirement ($100,000+/year):
• Upscale home, frequent travel
• Fine dining, premium experiences
• Requires significant wealth
• Needs: ~$2.5M+

Calculating YOUR number:
1. Estimate annual spending in retirement
2. List major expenses: Housing, healthcare, travel, hobbies
3. Use 4% rule: Multiply annual spending × 25

Example:
Annual spending estimate: $55,000
• Housing: $20,000
• Healthcare: $10,000
• Food: $12,000
• Travel: $8,000
• Hobbies: $5,000

Target nest egg: $55,000 × 25 = $1,375,000

Plan adjustments: Revisit your retirement plan every 5 years. If your investments outperform, you can increase spending. If underperform, adjust.`,
    question: RETIREMENT_PRETEST[10]
  },
  {
    title: "Lesson 12: Putting It All Together",
    content: `A comprehensive retirement plan combines all elements: 401(k)s, IRAs, Social Security, pensions, and personal savings.

Sample retirement plan for 25-year-old earning $60,000:

Phase 1 (Age 25-30): Foundation building
• Contribute $2,000/month to 401(k) (including employer match)
• Contribute $7,000/year to Roth IRA
• Total annual savings: $31,000 (52% of gross income)
• Goal: Build $150,000-200,000

Phase 2 (Age 30-40): Growth acceleration
• Increase 401(k) to $3,000/month (as income grows)
• Max Roth IRA
• Start taxable brokerage account with extra savings
• Total annual savings: $50,000+
• Goal: Build $400,000-600,000

Phase 3 (Age 40-50): Peak earning years
• Max 401(k): $23,500/year
• Max Roth IRA: $7,000/year
• Aggressive taxable brokerage contributions
• Total annual savings: $75,000+
• Goal: Build $1,000,000-1,500,000

Phase 4 (Age 50-60): Final accumulation
• Max 401(k) + catch-up: $31,000/year
• Max Roth IRA + catch-up: $8,000/year
• Continue taxable investing
• Goal: Reach $1,500,000-2,000,000

Phase 5 (Age 60-67): Pre-retirement
• Continue contributions
• Decide Social Security claiming age
• Plan healthcare coverage
• Finalize withdrawal strategy

Retirement (Age 65+):
• Take Social Security (age 67 is often optimal)
• Withdraw from taxable accounts first
• Let 401(k) and Roth grow as long as possible
• Use 4% rule for annual withdrawals

This plan results in comfortable retirement with $50,000+/year income, requires starting young, and relies on compound growth.`,
    question: RETIREMENT_PRETEST[11]
  }
];
