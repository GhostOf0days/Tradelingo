export const RETIREMENT_PRETEST = [
  { question: "What is retirement planning?", options: ["Quitting your job tomorrow", "Saving and investing for life after work", "Buying a house", "Opening a checking account"], correctIndex: 1 },
  { question: "What is a 401(k)?", options: ["A savings account", "An employer-sponsored retirement plan", "A tax bill", "A government loan"], correctIndex: 1 },
  { question: "What is an IRA?", options: ["Individual Retirement Account", "International Revenue Agency", "Interest Rate Agreement", "Investment Risk Allocation"], correctIndex: 0 },
  { question: "What is compound interest?", options: ["Interest paid once", "Interest earned on principal and past growth", "A tax penalty", "A stock dividend"], correctIndex: 1 },
  { question: "What does employer match mean?", options: ["Your boss matches your salary", "Your employer contributes to your retirement account", "You match coworkers’ savings", "A tax refund"], correctIndex: 1 },
  { question: "What is Social Security?", options: ["A private pension", "Government retirement benefits", "Stock insurance", "A brokerage account"], correctIndex: 1 },
  { question: "What is inflation?", options: ["Prices rising over time", "Stock market growth", "Tax reduction", "Interest payments"], correctIndex: 0 },
  { question: "What is asset allocation?", options: ["Picking one stock", "Splitting investments across asset types", "Buying only bonds", "Selling investments yearly"], correctIndex: 1 },
  { question: "What is a Roth IRA?", options: ["Tax-free withdrawals in retirement", "A government bond", "A stock fund", "A penalty account"], correctIndex: 0 },
  { question: "What is a pension?", options: ["A guaranteed retirement income from an employer", "A savings app", "A type of stock", "A tax credit"], correctIndex: 0 },
  { question: "What is the 4% rule?", options: ["Invest 4% of income", "Withdraw 4% annually in retirement", "Earn 4% returns", "Pay 4% in taxes"], correctIndex: 1 },
  { question: "What is sequence of returns risk?", options: ["The order of investment returns affecting outcomes", "Daily stock volatility", "Interest rate changes", "Dividend timing"], correctIndex: 0 }
];

export const RETIREMENT_LESSONS = [
  {
    title: "Lesson 1: What is Retirement Planning?",
    content: `Retirement planning means preparing financially for life after full-time work.

The goal is to replace your paycheck with income from investments, pensions, and benefits.

Starting early dramatically reduces how much you need to save due to compounding.`,
    question: RETIREMENT_PRETEST[0]
  },
  {
    title: "Lesson 2: 401(k) Plans",
    content: `A 401(k) is an employer-sponsored retirement account funded with pre-tax payroll contributions.

Advantages:
• Tax-deferred growth
• Automatic investing
• Potential employer match

For many workers, this is the foundation of retirement savings.`,
    question: RETIREMENT_PRETEST[1]
  },
  {
    title: "Lesson 3: IRAs",
    content: `An IRA (Individual Retirement Account) is a personal retirement account.

Types:
• Traditional – Tax deduction now, taxed later
• Roth – Taxed now, tax-free later

IRAs provide flexibility and additional savings capacity beyond a 401(k).`,
    question: RETIREMENT_PRETEST[2]
  },
  {
    title: "Lesson 4: Compound Interest",
    content: `Compound interest means earning returns on both your original investment and prior gains.

Over decades, compounding turns small consistent investments into large sums.

Time is your most powerful advantage.`,
    question: RETIREMENT_PRETEST[3]
  },
  {
    title: "Lesson 5: Employer Match",
    content: `Employer match is when your company contributes to your 401(k) based on your contributions.

Example:
Contribute 5%, employer matches 5% — that's an immediate 100% return.

Always capture the full match if possible.`,
    question: RETIREMENT_PRETEST[4]
  },
  {
    title: "Lesson 6: Social Security",
    content: `Social Security provides government-backed retirement income funded by payroll taxes.

It typically replaces 30–40% of pre-retirement income.

It should supplement, not replace, personal savings.`,
    question: RETIREMENT_PRETEST[5]
  },
  {
    title: "Lesson 7: Inflation",
    content: `Inflation reduces purchasing power over time.

If inflation averages 3%, your money must grow faster than that to maintain lifestyle.

Retirement plans must account for decades of rising costs.`,
    question: RETIREMENT_PRETEST[6]
  },
  {
    title: "Lesson 8: Asset Allocation",
    content: `Asset allocation is how you divide investments between stocks, bonds, and cash.

Younger investors often favor stocks for growth.
Older investors shift toward bonds for stability.

Allocation drives long-term results more than stock picking.`,
    question: RETIREMENT_PRETEST[7]
  },
  {
    title: "Lesson 9: Roth IRA",
    content: `A Roth IRA allows tax-free withdrawals in retirement.

You contribute after-tax money, but growth and withdrawals are tax-free.

Ideal for young earners expecting higher future income.`,
    question: RETIREMENT_PRETEST[8]
  },
  {
    title: "Lesson 10: Pensions",
    content: `A pension provides guaranteed lifetime income funded by an employer.

Less common today outside government and union jobs.

They reduce personal savings burden but offer less flexibility.`,
    question: RETIREMENT_PRETEST[9]
  },
  {
    title: "Lesson 11: The 4% Rule",
    content: `The 4% rule suggests withdrawing 4% of your retirement portfolio annually.

Example:
$1,000,000 portfolio → $40,000 annual withdrawal.

It aims to make savings last 30+ years, though market conditions may require flexibility.`,
    question: RETIREMENT_PRETEST[10]
  },
  {
    title: "Lesson 12: Sequence of Returns Risk",
    content: `Sequence risk refers to the order in which investment returns occur.

Poor returns early in retirement can permanently damage a portfolio.

Strategies to reduce risk:
• Maintain cash reserves
• Flexible withdrawals
• Balanced allocation

Managing sequence risk is critical during the first 5–10 retirement years.`,
    question: RETIREMENT_PRETEST[11]
  }
];