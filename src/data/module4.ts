// src/data/module4.ts - Brokers and Trading Platforms

export const MODULE_4_PRETEST = [
  { question: "What is a broker?", options: ["A bank", "An intermediary that executes trades on your behalf", "A type of stock", "An investment advisor"], correctIndex: 1 },
  { question: "What are the main types of brokers?", options: ["Full-service only", "Discount and full-service", "Government brokers", "Bank brokers"], correctIndex: 1 },
  { question: "What is a commission in trading?", options: ["Government tax", "Fee charged by broker for executing trades", "Profit from your trades", "A type of stock"], correctIndex: 1 },
  { question: "What are fractional shares?", options: ["Broken shares", "Ability to own portions of shares instead of whole shares", "Free shares", "Shares at a discount"], correctIndex: 1 },
  { question: "What is a margin account?", options: ["An account with borders", "Brokerage account that allows you to borrow money to trade", "A savings account", "A type of stock"], correctIndex: 1 },
  { question: "What is a settlement date?", options: ["Date you buy", "Date broker receives funds", "Date you receive your shares after trade", "Trading deadline"], correctIndex: 2 },
  { question: "What is T+2 settlement?", options: ["Trade in 2 days", "Settlement 2 days after trade date", "2 second transaction", "Two-tier trading"], correctIndex: 1 },
  { question: "What is a market order?", options: ["Order placed in market hours", "Buy/sell at current market price immediately", "An order for entire market", "Selling entire portfolio"], correctIndex: 1 },
  { question: "What is a limit order?", options: ["Order with limits", "Buy/sell only at specific price or better", "Order to limit losses", "Selling only some shares"], correctIndex: 1 },
  { question: "What is day trading?", options: ["Trading during day only", "Buying and selling securities on same day", "Trading 5 days a week", "Long-term trading"], correctIndex: 1 },
  { question: "What is the Pattern Day Trader (PDT) rule?", options: ["Trading pattern strategy", "Need $25K minimum to day trade in US", "Daily limit on trades", "Pattern matching trading"], correctIndex: 1 },
  { question: "What is a watchlist?", options: ["List of people watching you", "List of stocks you're monitoring", "Most watched stocks", "Trending stocks"], correctIndex: 1 },
  { question: "What are trading hours?", options: ["Any time", "9:30 AM - 4:00 PM ET (US market)", "Broker dependent", "24 hours"], correctIndex: 1 },
  { question: "What is after-hours trading?", options: ["Trading after you close app", "Trading outside regular market hours", "Late night trading", "Trading after profit"], correctIndex: 1 },
  { question: "What is short selling?", options: ["Selling small amounts", "Borrowing shares to sell, then buying back cheaper", "Quick profit strategy", "Selling before buying"], correctIndex: 1 }
];

export const MODULE_4_LESSONS = [
  {
    title: "Lesson 1: What is a Broker?",
    content: `A broker is an intermediary that executes trades on your behalf. Think of them as a middleman between you and the stock exchange.

How brokers work:

Traditional flow (before online brokers):
1. You call your broker
2. Broker places order on exchange
3. Exchange finds buyer/seller
4. Trade executes
5. Settlement occurs (funds transfer)
6. Broker charges commission

Modern flow (today):
1. You open broker app/website
2. You place order
3. Broker's system automatically sends to exchange
4. Trade executes in seconds
5. Settlement automatic
6. Commission charged (usually $0 for stocks now)

Key broker roles:
• Execute trades (buy/sell orders)
• Hold your securities in custody
• Provide trading platform (app/website)
• Charge fees for services
• Provide research and tools
• Ensure regulatory compliance
• Hold cash for trading
• Provide margin (borrowed money)

Evolution of brokers:

1970s-1990s: Full-service brokers
• Schwab, Merrill Lynch
• High commissions ($50-100 per trade)
• Personal advisor guidance
• Research and recommendations

1990s-2000s: Discount brokers
• E-Trade, TD Ameritrade
• Lower commissions ($10-20 per trade)
• Self-directed trading
• Online platforms

2010s: Zero-commission revolution
• Robinhood, M1 Finance, Fidelity
• Zero commission on stocks/ETFs
• Fractional shares available
• Mobile-first experience

2020s+: Brokers as financial platforms
• Crypto trading
• Options trading
• Advanced tools
• Social features
• Education integrated

Selecting a broker:

Cost considerations:
• Commission per trade (usually $0 now)
• Account minimum (many zero now)
• Margin interest rates (if using margin)
• Options trading fees (if applicable)
• Wire transfer fees (usually $0-$25)

Platform considerations:
• Ease of use (interface quality)
• Mobile app quality
• Desktop platform features
• Charting tools
• Research provided
• Customer service quality

Account types:
• Cash account: Only spend money you have
• Margin account: Can borrow up to 50% of portfolio
• IRA: Tax-advantaged retirement account
• Business accounts: For LLCs, S-corps

Popular brokers (2024):

Fidelity:
• Great for beginners and pros
• No commission on stocks/ETFs/options
• Excellent customer service
• Research tools
• Financial planning tools included

Vanguard:
• Excellent for long-term investors
• Low-cost index funds
• No commission on trades
• Retirement account focused
• Educational resources

TD Ameritrade (now Charles Schwab):
• Merger completed
• Powerful trading platform (thinkorswim)
• Great for active traders
• Research and education
• Good mobile app

Robinhood:
• Designed for beginners
• Simplistic interface (good or bad)
• Zero commission stocks/crypto
• Fractional shares
• Controversial business practices

Interactive Brokers:
• For advanced traders
• International trading available
• Lowest margin rates
• Complex platform
• Professional tools

Broker regulation:

US brokers regulated by:
• SEC (Securities and Exchange Commission)
• FINRA (Financial Industry Regulatory Authority)
• FDIC for cash deposits (up to $250K)
• SIPC (Securities Investor Protection Corporation) - protects against broker failure

This means:
• Your deposits are insured up to $250K
• If broker fails, SIPC protects your securities
• Your stocks are protected
• You can complain to regulators

Account protection:
• Cash: Insured up to $250K per account
• Securities: Protected by SIPC up to $500K
• Spread accounts: Get more protection
• Different brokers, different protection

What brokers can't do:
• Access your money without authorization
• Invest your money without permission
• Lend shares without disclosure (usually)
• Sell securities without order
• Charge excessive fees
• Engage in conflict of interest

Opening your first account:

Required information:
• Name and address
• Social Security number
• Employment information
• Income level (for margin applications)
• Investment experience (for options approval)

Account funding:
• Bank transfer (ACH) - free, 1-3 days
• Wire transfer - fast, may have fee
• Check deposit - slow, no fee
• Robinhood Pay - instant transfers

Time to open: 5-15 minutes usually

First trade:
• Pick stock (Apple, Microsoft, etc.)
• Decide quantity (or $ amount for fractional)
• Choose order type (market or limit)
• Review order
• Submit
• Order executes

Remember:
• Broker is your gateway to markets
• Choose one that fits your needs
• All major brokers similar quality
• Fee difference minimal now
• Focus on ease of use and education`,
    question: MODULE_4_PRETEST[0]
  },
  {
    title: "Lesson 2: Broker Types and Models",
    content: `Different brokers operate with different business models, affecting costs and conflicts of interest.

Full-service brokers:

What they are:
• Merrill Lynch, Morgan Stanley, UBS
• Dedicated advisor manages your account
• Make recommendations
• Handle all trading
• Provide wealth management

How they profit:
• 0.5-1% annual fee on assets under management
• Commission on trades
• Fees for financial planning
• Referral fees
• Can create conflicts of interest

Best for:
• High net worth individuals ($1M+)
• Those wanting professional management
• People needing financial planning
• Those willing to pay for advice

Discount brokers:

What they are:
• Charles Schwab, TD Ameritrade, Fidelity
• Self-directed trading platform
• Optional advisory services available
• Low commissions or zero

How they profit:
• Commissions on trades (now mostly $0)
• Interest on margin loans
• Selling order flow (execute trades through market makers)
• Premium features/subscriptions
• Financial advisor services (paid)

Best for:
• DIY investors
• Active traders
• Cost-conscious investors
• Those wanting independence

Robo-advisors:

What they are:
• Betterment, Wealthfront, M1 Finance
• Algorithm manages portfolio
• Automatic rebalancing
• Low fees
• Tax optimization

How they profit:
• 0.25-0.50% annual fee
• Interest on cash
• Premium subscription features

Best for:
• Lazy investors
• Hands-off approach
• Passive investing
• Those wanting automatic management

Order flow model controversy:

What is order flow?
• When you place order, broker decides where to send it
• Can send to exchange (Nasdaq, NYSE)
• Can send to market maker

The issue:
• Market makers pay brokers for order flow
• Market makers profit by buying slightly lower, selling slightly higher (bid-ask spread)
• You get worse execution than exchange
• Robinhood criticized for this

Example:
• You want to buy Apple at "market price"
• Broker sends order to Robinhood market maker
• Market maker shows you $150.01 (slightly worse than real exchange $150.00)
• Market maker keeps the spread ($0.01 × 100 shares = $1)
• You lose $1, market maker gains $1

Some brokers transparent about this, others not.

Execution quality:

Best execution:
• Broker sends to exchange directly
• You get true market price
• Faster execution
• No middleman

Okay execution:
• Broker uses market maker
• Might get slightly worse price
• Very slight delay
• Don't notice for long-term investors

Poor execution:
• Deliberately sending to worst market maker
• Prioritizing profit over customer
• Should be avoided
• Regulatory issue

PFOF (Payment for Order Flow) controversy:

The argument against:
• Creates conflict of interest
• Retail investors get worse prices
• Unfair advantage to professionals
• Should be banned

The argument for:
• Enables zero commission trading
• Alternative is high commissions
• Market makers provide liquidity
• Very small price impact

SEC's position:
• Allowed but disclosure required
• Under review in 2024+
• May be changing regulations
• Retail investor protection focus

Different broker models impact costs:

Scenario: Buy 100 shares of Apple at market

Traditional broker (0.5% fee):
• Buy 100 shares at $150 = $15,000
• 0.5% fee = $75
• Total cost = $15,075

Discount broker (no commission):
• Buy 100 shares at $150 = $15,000
• With PFOF: Price might be $150.01
• Cost to you = $15,001 (vs $15,000)
• Net benefit even with PFOF = free vs $75

Robo-advisor (0.25% fee):
• Automatically rebalances
• Optimizes taxes
• You might save money through tax loss harvesting
• 0.25% fee seems small but adds up

Long-term impact:

1% in fees = huge difference over time

$10,000 invested, 7% annual returns:
• No fees: $19,644 after 10 years
• 0.5% fees: $18,515 (lose $1,129)
• 1.0% fees: $17,460 (lose $2,184)

Over 30 years:
• No fees: $76,123
• 0.5% fees: $64,767 (lose $11,356)
• 1.0% fees: $54,911 (lose $21,212)

Fees compound against you!

Choosing based on model:

Choose full-service if:
• You want professional management
• You have $1M+ to invest
• You need financial planning
• You're okay with 0.5-1% fees

Choose discount if:
• You want to self-direct
• You have <$500K
• You prefer low fees
• You're comfortable with research

Choose robo-advisor if:
• You want hands-off investing
• You want automated rebalancing
• You need tax optimization
• You prefer algorithm to human advisor

Key takeaway:
Model matters less than total costs. Compare all-in costs (fees + execution quality) when choosing.`,
    question: MODULE_4_PRETEST[1]
  },
  {
    title: "Lesson 3: Order Types and Execution",
    content: `Understanding order types is critical to executing trades the way you want.

Market orders:

What: Buy/sell immediately at best current price
How it works:
1. You submit market order to buy 100 Apple
2. Broker searches for sellers at best price
3. If best price is $150.00, you buy at $150.00
4. If needs $150.00 and $150.01, splits order
5. Order completes in seconds usually

Pros:
• Guaranteed execution
• Fast (seconds)
• Simple
• Good for liquid stocks

Cons:
• Worst possible price (slippage)
• Fast-moving stocks might execute at unexpected price
• Not ideal for large orders

When to use:
• Buying stable stocks (Apple, Microsoft, etc.)
• When price doesn't matter much
• Want quick execution
• Trading popular stocks

Example: You place market order at 2:00 PM
Real price: $150.00
By time order reaches exchange: Price jumped to $150.15
You execute at $150.15 (1000 shares) = $15,015

Limit orders:

What: Buy/sell ONLY at specified price or better
How it works:
1. You submit limit order to buy 100 Apple at $149.50
2. Order waits in queue
3. When Apple drops to $149.50, order executes
4. If never reaches $149.50, order never fills

Pros:
• Price control (you set price)
• Potentially save money (buy lower)
• No slippage risk
• Good for patient investors

Cons:
• Might not execute (price never hits)
• Opportunity loss (miss the trade)
• Slower execution
• Not guaranteed

When to use:
• Specific price targets
• Buying dips
• Selling peaks
• Not in hurry

Example: Limit order to buy Apple at $149.00
Apple currently $152.00
You set limit: $149.00
Apple drops to $149.00 → Order executes
Apple never drops to $149.00 → Order never fills

Stop-loss orders:

What: Sell when price drops to specified level
How it works:
1. You own 100 Apple at $150 entry
2. You set stop-loss at $145
3. If Apple drops to $145, order triggers
4. Stock sells at market price (usually $145 or slightly lower)

Pros:
• Limits losses automatically
• Removes emotion from selling
• Protects capital
• Prevents panic

Cons:
• Stops you out at wrong time (if temporary dip)
• Activates market order (might get bad price)
• In gap down, might execute much lower
• Can lock in losses prematurely

When to use:
• Volatile stocks
• Protecting profits
• Risk management
• Preventing emotional decisions

Example: Stop-loss in crisis
Apple crashes from $150 → $130 gap down overnight
Your stop-loss at $145 never triggers (skips that price)
Instead triggers at $130 (market order)
You lose $20/share instead of $5

This is why trailing stops are better.

Trailing stop orders:

What: Stop-loss that follows price up
How it works:
1. You own Apple at $150
2. Set trailing stop of 5%
3. Apple rises to $160 → Stop-loss moves to $152
4. Apple drops to $152 → Order triggers, you sell
5. Also exits if Apple stays up but drops 5%

Pros:
• Protects upside while limiting downside
• Follows price up
• Better than static stop-loss
• Good for volatile stocks

Cons:
• Can still trigger on temporary pullbacks
• Gap down can still hurt
• More complex

When to use:
• Winning trades
• Capturing gains with downside protection
• Volatile stocks
• Trend-following strategies

Stop-limit orders:

What: Combination of stop-loss and limit order
How it works:
1. Set stop price: $145
2. Set limit price: $144
3. If Apple drops to $145, order triggers
4. Order becomes limit order to sell at $144 or better
5. If price drops below $144, order never fills

Pros:
• Protects against gapping down
• Price control on exit
• Good combo of both order types

Cons:
• Complex to understand
• Might not execute in gap down
• Might end up holding when wanted to sell

When to use:
• Volatile stocks with gap risk
• When exit price really matters
• Protecting against gaps

Good-'til-canceled (GTC) orders:

What: Limit order that stays until canceled or filled
How it works:
1. Place limit order to buy at $140
2. Order stays active for 30-90 days (varies by broker)
3. If hits $140, executes
4. If doesn't hit, cancels after 30-90 days

Pros:
• Patient investing
• Don't have to monitor
• Automates buying dips

Cons:
• Can forget about it
• Price might reach and you regret
• Can't modify easily
• Need to monitor expiration

Time-based orders:

Day orders: Expire at end of trading day
Good-'til-canceled: Expire after 30-90 days
Immediate-or-cancel: Cancel any unfilled portion immediately
All-or-none: Only execute if entire order can fill

Which order to use for your strategy:

Beginners:
• Market orders for simplicity
• Limit orders for buying dips
• Stop-loss orders for protection

Intermediate:
• Limit orders primarily
• Trailing stops for winners
• Good-'til-canceled for patience

Advanced:
• Stop-limit orders
• Conditional orders
• Algorithmic execution
• Options orders

Key takeaway:
Different orders suit different situations. Master these 4:
1. Market (quick execution)
2. Limit (price control)
3. Stop-loss (downside protection)
4. Trailing stop (profit protection)`,
    question: MODULE_4_PRETEST[3]
  },
  {
    title: "Lesson 4: Trading Hours and Execution",
    content: `Understanding market hours and execution rules is critical for effective trading.

Regular trading hours:

US stock market:
• Opens: 9:30 AM ET
• Closes: 4:00 PM ET
• Monday-Friday (weekdays only)
• Weekends and holidays closed

Pre-market trading:
• Starts: 4:00 AM ET (some brokers)
• Ends: 9:30 AM
• Lower volume
• Wider spreads
• Higher volatility
• Fewer orders fill

After-hours trading:
• Starts: 4:00 PM ET
• Ends: 8:00 PM ET (some brokers extend to 4 AM next day)
• Lower volume
• Wide spreads
• Higher volatility
• Risk of gap at market open

Extended hours:
• More trading opportunities
• But less liquidity
• Worse prices
• Not recommended for beginners
• Good for news reactions

Example extended hours trade:

Company announces bad earnings after 4 PM
Stock down 10% after-hours
In pre-market, down 15%
At market open, stabilizes at down 12%

If you reacted in after-hours, you might have gotten worse price and bought at wrong time.

Settlement and T+2:

What is settlement?
When you buy stock, there's delay before you own it. This is settlement.

How it works:
Day 1: You buy 100 Apple (Trade date)
Day 3: You own the shares (Settlement date)
Delay = 2 trading days

This is T+2 (Trade + 2 days)

Why the delay?
Clearing houses need time to:
• Verify both sides of trade
• Transfer funds
• Transfer securities
• Prevent fraud

What can you do before settlement?
In cash account: Nothing (can't sell until settled)
In margin account: Can use before settlement (borrow power)

How this affects you:

You buy Monday: T+0
Settlement Wednesday: T+2
You can sell Thursday: Can't sell until settlement

In margin account:
You buy Monday: T+0
You can sell Monday: Margin covers you temporarily
Settlement Wednesday: Funds clear against margin

Using settled vs unsettled funds:

Cash account:
You deposit $5,000 Monday
It takes 1-2 business days to settle
Only after settlement can you trade with full $5,000

Margin account:
You deposit $5,000 Monday
You can immediately trade with $10,000 (2x leverage)
When settlement occurs, leverage resets

Buying power:

Cash account:
Buying power = cash on hand
$5,000 cash = $5,000 buying power

Margin account (2x leverage):
$5,000 cash = $10,000 buying power
Can borrow up to 50% of position

Unsettled funds:
Not counted as buying power in cash account
Counted in margin account (usually)

Good faith violations:

What is it?
• Selling securities before buying funds settle
• Only applies to cash accounts
• 3 violations in 12 months = 90-day freeze
• Margin accounts not subject to this

Example:
Account has $0 cash
You get $5,000 wire Monday (T+0)
You buy stock with that $5,000
You sell that stock Tuesday (before T+2 settlement)
You committed "good faith violation"
3 of these = 90-day trading freeze

How to avoid:
Wait for settlement before trading
Only trade with settled funds
Use margin account if frequent trading
Plan 2 trading days ahead

Volume impact on execution:

High volume stocks (Apple, Tesla, Microsoft):
• Tight spreads ($0.01)
• Instant execution
• No slippage usually
• Market orders fine

Low volume stocks (small caps):
• Wide spreads ($0.10+)
• Slow execution
• Slippage risk
• Limit orders better

Illiquid stocks:
• Very wide spreads ($1.00+)
• Hard to exit
• Avoid market orders
• Might not fill

Volatility impact:

Normal conditions:
• Market order works fine
• Execution predictable
• Spreads tight

Volatile conditions (crisis, earnings):
• Wide spreads
• Execution uncertain
• Slippage risk
• Limit orders safer

After earnings:
• Stock gaps up/down
• Your stop might not execute
• Orders pile up
• Execution delayed

During market close (last minute):
• Volume spikes
• Execution slows
• Orders delayed
• Avoid trading last minute

Pattern Day Trading (PDT) rule:

What is it?
• Need $25,000 minimum to day trade (buying and selling same day)
• Applies to margin accounts
• In US stock market
• Enforced by FINRA

How it works:
Day 1: Buy 100 shares → Sell 100 shares = 1 day trade
Day 2: Buy 50 shares → Sell 50 shares = 1 day trade
Over 5 trading days: 4+ day trades = flagged as PDT
PDT account = must maintain $25K minimum

If violation:
• Account restricted 90 days
• Can't day trade during restriction
• Can still hold stocks

Workarounds:
• Use cash account (but subject to good faith violations)
• Keep $25K minimum
• Trade less frequently
• Use brokers with delayed settlement (more rare)

Settlement around the world:

Different countries have different settlement times:
• US: T+2
• Europe: T+2
• UK: T+2
• Japan: T+3
• Australia: T+2

Moving towards T+1 globally (faster)

Practical execution tips:

For most traders:
• Use market orders for liquid stocks
• Use limit orders for less liquid
• Avoid pre/post market for beginners
• Trade in regular hours 10 AM - 3 PM (avoid open/close chaos)
• Avoid trading during earnings/news
• Wait for settlement before relying on funds
• Never use leverage if inexperienced
• Plan trades with 2-day settlement in mind`,
    question: MODULE_4_PRETEST[6]
  },
  {
    title: "Lesson 5: Margin and Leverage",
    content: `Margin is borrowing money from your broker to trade. It can amplify both gains and losses.

How margin works:

Basic concept:
• You have $5,000
• Broker lets you borrow $5,000
• You can now trade with $10,000 (2x leverage)
• If trade profits, profit is yours
• If trade loses, you owe the loss

Example (winning):
You have $5,000
Borrow $5,000 on margin
Buy 100 shares at $100 = $10,000
Stock goes to $120
You sell for $12,000
Repay broker $5,000 + interest
Profit = $7,000 - $5,000 - interest = ~$1,900
Without margin: Profit would be $2,000

So margin helped (but cost interest).

Example (losing):
You have $5,000
Borrow $5,000 on margin
Buy 100 shares at $100 = $10,000
Stock goes to $80
You sell for $8,000
Repay broker $5,000 + interest
Loss = $8,000 - $5,000 - interest = ~$2,900
Without margin: Loss would be $2,000

Margin amplified the loss.

Margin requirements:

Reg T (Regulation T):
• Minimum 50% equity requirement
• If you have $10,000 account, can borrow up to $10,000
• Account minimum is $2,000 typically

Example:
$10,000 account with 50% requirement:
• Can borrow up to $10,000
• Max buying power $20,000
• If loss 50%, margin call triggers

Margin maintenance:
• Must maintain 25-30% equity
• Different brokers, different requirements
• Falling below = margin call

Margin call example:

Starting position:
• Account: $10,000
• Borrow: $10,000
• Buy 100 shares at $200 = $20,000

Stock drops:
• Share price $150
• Position worth $15,000
• You owe $10,000
• Equity = $5,000
• Equity % = 33% (still safe, above 30%)

Stock drops more:
• Share price $130
• Position worth $13,000
• You owe $10,000
• Equity = $3,000
• Equity % = 23% (MARGIN CALL - below 30%)

Margin call means:
• Deposit more money (bring equity back up)
• Sell shares to repay debt
• Broker can force sell your shares
• Consequences

If you can't meet margin call:
Broker will force sell your positions:
• Usually sells worst performers first
• Takes losses for you
• You can't stop it
• Fee may apply

Margin interest costs:

Margin rates vary by broker:
• Usually 6-12% annual interest
• Based on amount borrowed
• Can be higher in bull markets
• Lower in bear markets

Example interest cost:
Borrow $10,000 for 1 year at 9%:
• Interest cost = $900
• Monthly interest = $75
• This comes out of your profits

Over 10 years:
$10,000 borrowed × 9% = $900/year
If held 10 years = $9,000 in interest
Your stock needs to gain $10,900+ just to break even

Margin vs leverage:

These terms used interchangeably:
Margin = borrowing money to trade
Leverage = ratio of borrowed money to your own

Example:
2:1 leverage = $1 of your money, $1 borrowed = $2 trading power
3:1 leverage = $1 of your money, $2 borrowed = $3 trading power
10:1 leverage = $1 of your money, $9 borrowed = $10 trading power

Futures and options allow higher leverage:
Futures: Up to 20:1 leverage
Options: Up to 100:1 leverage (theoretically infinite with naked calls)
Forex: Up to 50:1 leverage (banned in US for retail)

How leverage amplifies:

$1,000 account, buy stock up 10%:
No leverage: Gain $100 (10% return)
2x leverage: Gain $200 (20% return)
10x leverage: Gain $1,000 (100% return)

But also:
Stock down 10%:
No leverage: Lose $100 (-10% return)
2x leverage: Lose $200 (-20% return), owe $200
10x leverage: Lose $1,000 (-100% return), completely wiped out + owe money

When margin makes sense:

✓ Do use if:
• Using for buy-and-hold stocks
• Small amount (less than 20% leverage)
• Need short-term capital (temporary)
• Have stable income
• Can afford payments if losses

✗ Don't use if:
• Day trading (losses amplified)
• Volatile stocks (margin calls likely)
• Can't afford margin interest
• Inexperienced trader
• Speculating on small-caps
• In debt already

Successful margin strategies:

Conservative:
• Borrow <20% of portfolio
• Buy blue-chip stocks
• Long-term hold
• Pay interest from income

Interest arbitrage:
• Borrow at 8%
• Invest in dividend stock paying 4%
• Net cost 4% (but risky)
• Only if confident in stock

Tax reduction:
• Borrow to buy stock
• Use losses elsewhere to offset taxes
• Margin interest is tax deductible
• Complex strategy

Failed margin strategies:

What most people do wrong:
• Borrow too much
• Use on volatile stocks
• Try to day trade with margin
• Don't monitor positions
• Panic in downturns
• Can't pay margin interest

Percentage of margin traders who fail: >90%

Common mistakes:

"I'll double my money on margin"
• True, but also can double your losses
• Most accounts go to zero
• Can actually owe more than account value

"It's free money from the broker"
• You pay interest
• You risk ruin
• Not free

"I'll use margin temporarily"
• Interest costs add up
• Markets move against you
• "Temporary" becomes permanent
• Account depleted

Margin rules to follow:

1. Never borrow more than you can repay
2. Only use for quality companies
3. Don't use leverage for speculation
4. Monitor positions closely
5. Set strict stop losses
6. Have emergency fund for margin calls
7. Understand math before borrowing
8. Start with 0% margin (cash account)

Most successful investors rarely use margin. Warren Buffett uses minimal leverage.

Key takeaway:
Margin amplifies both gains and losses. Most retail traders lose money with margin. Only use if you understand the risks and have specific strategy. Better to trade with cash and grow slowly than to blow up account with leverage.`,
    question: MODULE_4_PRETEST[4]
  },
  {
    title: "Lesson 6: Broker Tools and Research",
    content: `Modern brokers provide extensive tools for research and analysis.

Charting tools:

Basic charting:
• Time frames: 1 min, 5 min, hourly, daily, weekly, monthly
• Price data: Open, high, low, close
• Volume: Shares traded each period
• Overlays: Moving averages, Bollinger bands, etc.

Popular charting platforms:
• TradingView: Excellent free charts
• Thinkorswim (Charles Schwab): Powerful professional tools
• Robinhood: Simple charts
• Webull: Good free charts
• FinViz: Excellent for stock scanning

How charting helps:
• Identify trends (up/down/sideways)
• Find support/resistance levels
• Spot entry/exit points
• Confirm patterns
• Track volume changes

Common indicators:

Moving averages:
• 50-day MA: Medium-term trend
• 200-day MA: Long-term trend
• Price above 200-day = uptrend
• Price below 200-day = downtrend

RSI (Relative Strength Index):
• Measures momentum
• 0-100 scale
• Above 70 = overbought
• Below 30 = oversold
• Helps find reversals

MACD (Moving Average Convergence Divergence):
• Momentum indicator
• Bullish when MACD above signal line
• Bearish when below
• Crossovers indicate trend changes

Bollinger Bands:
• Shows volatility
• Upper/lower bands
• Price bounces off bands
• Narrow bands = low volatility
• Wide bands = high volatility

Relative strength:
• Compare stock performance to market
• If XYZ up 20% and market up 10%
• XYZ has positive relative strength
• Good for stock selection

Stock screening tools:

What are screeners?
Software that finds stocks meeting your criteria.

Common screeners:
• Finviz Elite: $39/month, excellent stock screener
• StockRover: $168/year, comprehensive
• ThinkorSwim: Free, professional-grade
• TradingView: Free, powerful
• Yahoo Finance: Free, basic

How to use:

Set criteria:
• Market cap: Large-cap only ($10B+)
• P/E ratio: Below 20
• Dividend: Yields above 2%
• RSI: Below 30 (oversold)
• Price above 200-day MA (uptrend)

Results:
Screener finds stocks matching ALL criteria.

Example results:
• Companies with good value
• Strong dividend yields
• In uptrend
• Oversold (potential reversal)

This narrows thousands of stocks to maybe 10-20 candidates for research.

Financial metrics and ratios:

P/E ratio (Price-to-Earnings):
• Stock price ÷ earnings per share
• Low P/E = undervalued
• High P/E = expensive or growth
• Average = 15-20

P/B ratio (Price-to-Book):
• Stock price ÷ book value per share
• Indicates value
• Below 1 = potentially undervalued

Dividend yield:
• Annual dividend ÷ stock price
• 2% average
• Higher = better for income

Debt-to-equity:
• Total debt ÷ shareholder equity
• Low = strong balance sheet
• High = leveraged company

Return on equity (ROE):
• Net income ÷ shareholder equity
• Measures profitability
• 10%+ is good

Where to find these:
• Yahoo Finance (free)
• Bloomberg (paid)
• Company investor relations (free)
• MarketWatch (free)
• Seeking Alpha (free, some paid)

Research capabilities by broker:

Fidelity:
• Excellent research library
• Analyst reports
• Stock ratings
• Educational content
• Investor reports

Charles Schwab/TD Ameritrade:
• ThinkorSwim platform (powerful)
• Professional-grade tools
• Conditional orders
• Advanced charting
• Strategy backtesting

Robinhood:
• Basic company information
• News feed
• Limited research
• "Collection" organization
• Not for serious researchers

Interactive Brokers:
• Professional research
• All major platforms available
• Advanced tools
• API for algorithms
• For professional traders

News and earnings:

Where to find news:
• Company investor relations page
• Financial news (CNBC, Bloomberg, Reuters)
• Social media (Twitter finance accounts)
• Earnings call transcripts
• SEC filings (10-K, 10-Q)

Earnings data:
• Quarterly earnings date
• Expectations (EPS, revenue)
• Actual results
• Guidance (forward expectations)
• Analyst changes

SEC filings:
• 10-K: Annual report (company health)
• 10-Q: Quarterly report
• 8-K: Important events
• All available free at SEC.gov

Company information:
Business model, competitive advantages, risks, management team

How to evaluate a company:

Quantitative (numbers):
• Revenue growth
• Earnings growth
• Margins and profitability
• Balance sheet strength
• Cash flow

Qualitative (judgment):
• Management quality
• Competitive moat
• Industry trends
• Product quality
• Brand strength

Both matter. Numbers show health, qualitative shows future potential.

Using broker tools effectively:

Step 1: Screen for candidates
Use screener with criteria you believe in

Step 2: Research top results
Read 10-K, check management, understand business

Step 3: Check technicals
Look at charts, identify support/resistance

Step 4: Compare competitors
Is this company better than peers?

Step 5: Place order
Use limit orders, avoid market orders

Step 6: Monitor
Check quarterly earnings, watch technicals

Key tools to master:

Beginner:
• Stock screener
• Company fundamentals (P/E, ROE, dividend)
• Simple price charts
• News sources

Intermediate:
• Advanced screening
• Financial ratio analysis
• Technical indicators
• Earnings analysis

Advanced:
• Backtesting strategies
• Options analysis
• Relative strength analysis
• Market microstructure

Remember:
More tools don't equal better results. Focus on understanding few tools well rather than mastering many poorly.`,
    question: MODULE_4_PRETEST[9]
  },
  {
    title: "Lesson 7: Risk Management and Psychology",
    content: `Technical trading skills matter less than risk management and emotional control.

Risk management basics:

Position sizing:

Rule 1: Risk fixed percentage per trade
• Risk only 1-2% of portfolio per trade
• $10,000 account = risk $100-200 max per trade
• If wrong, account only down 1-2%

Example:
You have $50,000
Risk 2% = $1,000 per trade
You expect stock to break $100 support
Your stop loss = $100 (you'd sell if broken)
Buy at $105
Risk = $5 per share × 200 shares = $1,000 loss
Potential reward = Stock goes to $120 = $3,000 gain

Reward-to-risk ratio: 3:1 (good)

Rule 2: Adjust position size to stop loss
Wider stop loss = smaller position
Tight stop loss = larger position

Example:
Stock A: Stop loss 2% away = Buy 1,000 shares
Stock B: Stop loss 10% away = Buy 200 shares
Both risk same $1,000

Rule 3: Never risk more than you can afford to lose
If losing $5,000 would hurt, don't risk it.

Win rate vs reward-to-risk:

You don't need high win rate if reward-to-risk good:

Scenario 1: 60% win rate, 1:1 reward-to-risk
10 trades: 6 wins × $1,000 = $6,000
4 losses × $1,000 = -$4,000
Net = $2,000 profit
Win rate 60%, healthy profit

Scenario 2: 40% win rate, 3:1 reward-to-risk
10 trades: 4 wins × $3,000 = $12,000
6 losses × $1,000 = -$6,000
Net = $6,000 profit
Win rate 40%, better profit than 60% case!

This means:
• You don't need to be right often
• You need reward-to-risk favorable
• This is key to success

Psychology of trading:

FOMO (Fear of Missing Out):
• Stock up 100%, you panic buy
• Usually at peak
• You're late to party
• Loses money

Solution: Plan trades in advance, don't chase momentum

Fear:
• Stock down 20%, you panic sell
• Sell at worst time
• Recovers immediately after
• Regret and losses

Solution: Pre-planned stop losses, trust your plan

Greed:
• Stock up 50%, you want more
• Don't take profits
• Waits for 100% gain
• Stock crashes back to breakeven
• You lose it all

Solution: Take profits at targets, don't be greedy

Overconfidence:
• Win streak makes you feel expert
• You increase position size
• Take bigger risks
• Eventually lose big

Solution: Keep position sizing consistent, don't vary

Revenge trading:
• Lost $2,000 yesterday
• Today you try to recoup
• Take bigger risks
• Lose more

Solution: Walk away, only trade when calm

Sunk cost fallacy:
• Stock down 50%, you bought at $100
• "I'm down too much to sell now"
• You hold hoping to recover
• Keeps dropping to $20
• Total loss 80% instead of 50%

Solution: Look forward, not backward. Where will it go, not where it came from

Cognitive biases:

Recency bias:
• Tech stock up last 5 years
• You assume it'll keep going up
• Market has cycles
• Get hurt when it falls

Confirmation bias:
• You think stock will go up
• You only read bullish articles
• Ignore bearish evidence
• Surprised when wrong

Hindsight bias:
• Trade loses money
• Later you think "I should have known"
• Makes you overconfident next time
• Ignoring that future is unknowable

Loss aversion:
• You're afraid of losses
• Hold losers too long (hoping recovery)
• Sell winners too early (locking in small gains)
• Net result = losses

Dealing with emotions:

Journal your trades:
• Entry reason
• Entry price
• Exit price
• Result (win/loss)
• Emotional state
• What you learned

This helps identify patterns in YOUR psychology.

Pre-trade checklist:
• Is my setup valid?
• Does reward-to-risk make sense?
• Am I emotional?
• Do I have conviction?
• What's my stop loss?
• What's my profit target?

If any answer is "no" or hesitant, don't trade.

Trade less frequently:
• Day traders: 90% lose money
• Swing traders: 70% lose money
• Long-term investors: 50% beat market

Taking time between trades helps remove emotion.

Accountability:
• Trade with real money (feel consequences)
• Tell someone your plan
• Stick to rules
• Keep records
• Face results

Trading plan example:

Entries:
• Wait for stock to pull back to 50-day MA
• In overall uptrend (above 200-day MA)
• RSI oversold (below 30)
• Enter with limit order

Exits:
• Profit target: 15% above entry
• Stop loss: 5% below entry
• Reward-to-risk: 3:1

Position sizing:
• Risk 1% of $50,000 = $500
• Stop loss 5% = Trade $10,000
• Risk-reward ratio checked

Rules:
• Max 3 trades per week
• Only trade 10 AM - 3 PM ET
• No trading after losses
• No FOMO entries
• Stick to the plan

Discipline beats intelligence:
Discipline: Following your plan
Intelligence: Understanding markets

Smart traders with poor discipline lose.
Average traders with discipline win.

Common trader mistakes:

1. Overtrading: Too many trades = high fees, emotions
2. Revenge trading: Trying to recover losses quickly
3. Position sizing: Too large = one bad trade ruins account
4. No stop loss: Hoping doesn't work, losses spiral
5. Chasing momentum: Buying at peaks, selling at lows
6. Not taking profits: Watching gains evaporate
7. Holding losers: Hoping for recovery that doesn't come
8. Lack of plan: Random trades, no edge
9. Not keeping records: Can't learn from mistakes
10. Blaming market: Not taking responsibility

The hard truth:
Most traders fail because of psychology, not lack of knowledge.

You could understand everything in this course and still lose money if you can't control emotions.

Mental training:
• Meditation (helps with discipline)
• Journal keeping (understand patterns)
• Real but small account (test with consequences)
• Find a mentor (accountability)
• Slow down (think before trading)
• Accept losses (part of trading)
• Celebrate discipline (not wins)

The best traders:
Boring, disciplined, consistent, patient.

The failed traders:
Emotional, overconfident, undisciplined, chasing.

Which will you be?`,
    question: MODULE_4_PRETEST[11]
  },
  {
    title: "Lesson 8: Account Types and Taxes",
    content: `Different account types have different tax treatments and advantages.

Taxable brokerage account:

What it is:
• Regular investment account
• No contribution limits
• Investments taxed yearly
• No special advantages

Tax implications:
• Capital gains tax: 15-20% (long-term)
• Short-term capital gains: Ordinary income (10-37%)
• Dividend income: Usually 15%
• Interest income: Ordinary income
• Lots of paperwork for IRS

Example:
You buy Apple at $150, sell at $200
• Gain = $50
• Long-term (held >1 year): 15% tax = $7.50 owed
• After tax profit = $42.50

You buy Apple at $150, sell at $200 (same day)
• Gain = $50
• Short-term: Ordinary income tax (say 25%) = $12.50 owed
• After tax profit = $37.50

Best uses:
• After you've maxed retirement accounts
• Large sums ($200K+)
• Money you might need soon
• Crypto trading (taxed aggressively)

Retirement accounts:

Traditional IRA:

What it is:
• Tax-deductible contributions
• Tax-free growth
• Taxed withdrawals in retirement
• Age 73+ required withdrawals

Contribution limits (2024):
• $7,000/year (age <50)
• $8,000/year (age 50+)

Tax on withdrawal:
You pay ordinary income tax on full withdrawal amount.

Example:
Contribute $7,000 deductible (saves $2,100 in taxes)
Grows to $70,000
Withdraw $70,000: Pay 25% tax = $17,500
Net after tax = $52,500

Roth IRA:

What it is:
• After-tax contributions
• Tax-free growth
• Tax-free withdrawals forever
• No required distributions

Contribution limits (2024):
• $7,000/year (age <50)
• $8,000/year (age 50+)

Tax on withdrawal:
Zero! All withdrawals are tax-free.

Example:
Contribute $7,000 after-tax
Grows to $70,000
Withdraw $70,000: Pay $0 tax
Net = $70,000

Which is better?

Traditional: If in high tax bracket now, low bracket later
Roth: If in low bracket now, high bracket later

For most young people: Roth is superior (tax-free growth)

401(k):

What it is:
• Employer-sponsored retirement plan
• Pre-tax contributions
• Employer matching
• Tax-deferred growth
• Required distributions age 73+

Contribution limits (2024):
• $23,500/year
• $31,000/year (age 50+)

Employer matching:
• Free money (1-6% typical)
• Must be maximized first
• Before maxing IRA

Tax implications:
• Pre-tax contributions (reduces taxable income)
• Growth tax-deferred
• Withdrawals taxed as ordinary income
• Early withdrawal: 10% penalty + taxes

HSA (Health Savings Account):

The triple tax advantage:
• Contributions tax-deductible
• Growth tax-free
• Withdrawals for medical tax-free

Contribution limits (2024):
• $4,150/year (individual)
• $8,300/year (family)

Most underused tax advantage!

Best uses:
• Self-employed
• High-deductible health plan
• Can save for future medical
• Also investment account (stocks, bonds, crypto)

Tax-loss harvesting:

What it is:
Strategy to reduce taxes using losses.

How it works:
• Own stock X, down 30%
• Sell at loss = $5,000 loss
• Use loss against capital gains
• Reduces taxes owed

Example:
Gains in taxable account:
• Stock A: +$10,000 gain
• Stock B: -$5,000 loss

Tax without harvest: $10,000 × 20% = $2,000
Tax with harvest: ($10,000 - $5,000) × 20% = $1,000
Tax saved: $1,000

Wash sale rule:
Can't buy same stock within 30 days of selling it at loss.

Solution:
Sell Stock B at loss
Buy similar stock (same sector)
Maintain diversification
30 days later, switch back if wanted

Trading gains and losses:

Short-term (held <1 year):
• Taxed as ordinary income
• 10-37% tax depending on bracket
• Worst tax treatment

Long-term (held >1 year):
• Taxed at capital gains rate
• 0%, 15%, or 20%
• Much better than short-term

Strategy: Hold for >1 year when possible

Qualified dividends:
Some dividends taxed at capital gains rate (15%) instead of ordinary income (37%).

Unqualified dividends:
Taxed as ordinary income (higher rate).

Best dividend stocks have qualified dividends.

Estimated taxes:

If you day trade:
• Profits are business income
• Owe quarterly estimated taxes
• Up to 4 times per year
• Penalty if underpay

Self-employed trading:
• Must file Schedule C
• Owes self-employment tax (~15%)
• Pay quarterly estimates
• Recordkeeping critical

Record keeping requirements:

Keep for 7 years:
• All buy/sell confirmations
• Cost basis documentation
• Dividend statements
• Interest statements
• Tax returns
• Trading logs/journal

Digital backup:
• Take screenshots
• Save PDF statements
• Cloud backup (Google Drive, Dropbox)
• Second backup (external hard drive)

Tax software:

TurboTax, H&R Block, TaxAct:
• Generate Forms
• Import brokerage data
• Calculate capital gains/losses
• Print tax return

Crypto tax software (if trading crypto):
• Koinly, TaxBit, CoinTracker
• Track all transactions
• Generate tax reports
• Export to tax software

Cost: $0-500 depending on complexity

Professional help:

When to hire CPA:
• Day trading ($100K+/year)
• Self-employed business income
• Complex strategies
• Multiple accounts
• Uncertain about rules

Cost: $1,000-3,000+ per year

Tax planning tips:

1. Max out tax-advantaged accounts first:
   401(k) → Roth IRA → Taxable

2. Hold long-term: Sell after 1+ years for lower taxes

3. Tax-loss harvest: Use losses to offset gains

4. Qualified dividends: Prefer stocks with qualified div

5. Avoid day trading: Huge tax burden

6. Track everything: Documentation critical

7. Plan ahead: Don't be surprised by taxes

8. Keep receipts: For deductions, cost basis

9. Use tax software: Accurate calculations

10. Consult CPA if complex: Peace of mind

Most important:
Many traders ignore taxes and blow up when tax bills come due.
Plan for taxes when planning trades.`,
    question: MODULE_4_PRETEST[12]
  },
  {
    title: "Lesson 9: Getting Started as a Trader",
    content: `Now that you understand brokers and trading, let's create an action plan.

Step 1: Choose your broker (1 week)

Compare top options:
• Fidelity (best all-around)
• Charles Schwab (best for active traders)
• Robinhood (best for simplicity)
• TD Ameritrade (best for research)

Based on your needs:
Beginner → Fidelity or Robinhood
Active trader → Charles Schwab or TD Ameritrade
Crypto focus → Coinbase or Kraken

Open account:
• Provide ID and basic info
• Fund account ($100 minimum usually)
• Takes 5-15 minutes

Step 2: Learn the platform (1 week)

Explore:
• How to place orders
• How to view charts
• How to check positions
• How to set alerts
• Customer support

Paper trading:
• Some brokers have simulators
• ThinkorSwim has excellent simulator
• Trade with fake money first
• Learn without real consequences

Practice with simulator:
• Spend 1-2 weeks in simulator
• Make 10-20 trades
• Get comfortable with platform
• Test your strategy

Step 3: Create trading plan (1-2 weeks)

Define your edge:

What's your advantage?
• Research skills (fundamental analysis)
• Pattern recognition (technical analysis)
• Patience (long-term holding)
• Contrarian thinking (buying dips)
• Specific knowledge (industry expertise)

Pick ONE edge. Master it. Ignore the rest.

Simple trader plans:

Plan 1: Value investor
• Buy undervalued stocks
• Hold 3-5 years
• Boring but profitable
• Low stress

Plan 2: Dividend investor
• Buy dividend stocks
• Earn passive income
• Hold long-term
• Tax efficient

Plan 3: Growth investor
• Buy growing companies
• Hold 2-5 years
• Higher volatility
• More research

Plan 4: Swing trader
• Hold 1-4 weeks
• Catch waves
• Requires more work
• Higher fees/taxes

Plan 5: Contrarian
• Buy when market down 10%+
• Hold 1-3 years
• Emotional discipline needed
• Often successful

Pick one. Master it.

Document your plan:
• When do you trade? (hours)
• How often? (once/week? 3x/week?)
• How much? (position size)
• What stocks? (criteria)
• Entry rule: When do you buy?
• Exit rule: When do you sell?
• Stop loss: When do you admit wrong?
• Profit target: When do you lock gains?

Example plan:

Name: "Buy the Dip" strategy
Hours: 10 AM - 3 PM ET only
Frequency: Once per week
Position size: 1% risk per trade

Entry criteria:
• Stock in uptrend (above 200-day MA)
• Stock pulls back to 50-day MA
• RSI below 30
• Buy with limit order at 50-day MA

Exit criteria:
• Profit target: 15% above entry
• Stop loss: 5% below entry
• If no signal: Hold until target
• Reward-to-risk: 3:1 minimum

Position sizing:
• Account: $50,000
• Risk: 1% = $500
• Stop loss: 5% = Equals $10,000 position
• Buy $10,000 at entry

Rules:
• No FOMO entries
• No revenge trading
• Journal every trade
• Review weekly
• Max 4 trades per month

Stick to plan for 3 months before changing.

Step 4: Start small (1 month)

Fund your account:
• Start with $1,000-5,000
• Money you can afford to lose
• Will feel "real" but not devastating
• Enough to learn lessons

Make your first trades:
• Execute plan you created
• Keep detailed journal
• Track emotions
• Follow rules rigorously

Don't worry about losing:
• Expect to lose 20% first 3 months
• That's learning cost
• Better lose small now than big later
• Real feedback is invaluable

Track every trade:

Entry:
• Date
• Stock
• Price
• Reason
• Expected move

Exit:
• Date
• Stock
• Price
• Result (win/loss)
• What happened
• What you learned

Emotional check:
• How did you feel?
• Did you follow plan?
• What was hard?
• What worked?

Step 5: Review and adjust (Monthly)

Monthly review meeting:
• Spend 1 hour reviewing trades
• What worked?
• What didn't work?
• What would you change?
• Did you follow your plan?

If plan not working:
• Change ONE thing at a time
• Wait 4-8 weeks to see impact
• Don't change constantly

If following plan well:
• Gradually increase position size
• Add more capital as confidence grows
• Expand to new sectors/stocks
• But keep core plan same

Step 6: Scale slowly (3-12 months)

Growing your account:

Month 1-2: $1,000-2,000
Month 3: $2,000-5,000
Month 6: $5,000-10,000
Year 1: $10,000-50,000

Growth comes from:
• Initial deposits (most important)
• Compound returns (less important)
• Learning and improving
• Sticking to plan

Full-time trading?

Most people ask: "When can I quit my job?"

Honest answer:
• Need $100K+ minimum
• Need 10+ years experience minimum
• Most traders fail even with that
• Better to trade part-time forever
• Less pressure = better results

Better approach:
• Keep your job
• Trade as side activity
• Eventually reach $50K+/month income
• THEN consider full-time

You never NEED to go full-time.

Common mistakes:

Quitting job too early:
• No income to live on
• Pressure ruins trading psychology
• Blow up account
• Regret

Not keeping day job:
• Income covers losses
• No pressure = better decisions
• Can compound profits back
• Less stress = more profits

Biggest mistake:
Thinking you'll get rich quick.

Reality:
• First year: 20% average loss (learning cost)
• Second year: Breakeven
• Third year: 20% gain
• Fourth year+: 15-30% annual gains

After 5 years of trading well:
$1,000 account → $4,000-5,000

Realistic expectations matter.

Your daily routine as trader:

Before market open (8:00-9:30 AM):
• Review overnight news
• Check economic calendar
• Scan watchlist
• Identify possible trades
• Have trade plan ready

During market hours (9:30 AM-4:00 PM):
• Monitor positions
• Check technicals
• Wait for setup
• Execute trades
• Manage open positions

After market close (4:00-5:00 PM):
• Review day
• Journal trades
• Check after-hours news
• Plan next day
• Relax (trading done for day)

Evening:
• Research stocks
• Review charts
• Update watchlist
• Read news/articles
• Learn (1-2 hours max)

Weekend:
• Review week
• Plan next week
• Relax and recharge
• No trading

Important:
Don't let trading consume your life.

Your success checklist:

Week 1:
☐ Choose broker
☐ Open account
☐ Fund account

Week 2:
☐ Explore platform
☐ Paper trade
☐ Get comfortable

Week 3-4:
☐ Create trading plan
☐ Document rules
☐ Define position sizing

Month 2:
☐ Make first real trades
☐ Journal every trade
☐ Follow your plan
☐ Expect to lose money

Month 3:
☐ Review month
☐ Identify mistakes
☐ Fix one thing
☐ Continue trading

Month 6:
☐ Review 6 months
☐ Are you profitable?
☐ Is plan working?
☐ Adjust if needed

Year 1:
☐ Have discipline
☐ Followed plan
☐ Learned lessons
☐ Ready to scale

Final thoughts:

Trading is not get-rich-quick.
Trading is get-rich-slow.

Most successful traders:
Boring, disciplined, patient, humble.

Take this seriously.
Treat it like business.
Keep records.
Follow rules.
Learn from mistakes.
Enjoy the journey.

Welcome to the trading journey!`,
    question: MODULE_4_PRETEST[14]
  },
  {
    title: "Lesson 10: Advanced Trading Strategies",
    content: `Now for some more sophisticated trading approaches.

Momentum trading:

Strategy:
• Identify stocks in strong uptrend
• Buy when momentum confirmed
• Sell when momentum slows
• Hold 2-4 weeks

How to identify:
• Stock up >20% in last 3 months
• Above 200-day MA (long-term uptrend)
• Volume increasing
• Institutional buying

Entry:
• Wait for pullback to 20/50-day MA
• Buy with limit order
• Confirm with volume

Exit:
• Sell if breaks 50-day MA
• Sell if volume dries up
• Sell at profit target (25-40%)
• Hold maximum 4 weeks

Win rate: 55-65%
Reward-to-risk: 2-3:1
Time commitment: Medium

Mean reversion:

Strategy:
• Stock oversold (down significantly)
• Wait for reversal
• Buy the dip
• Hold until recovery

How to identify:
• Stock down >20% in short time
• Bad news or market panic
• RSI very low (<20)
• Volume spike (capitulation)
• Fundamentals still intact

Entry:
• Wait for bounce (small reversal)
• Buy with limit order
• Volume should be high

Exit:
• Sell at 50% recovery
• Sell back to 20-day MA
• Sell if breaks lows
• Hold 1-4 weeks

Win rate: 60-70%
Reward-to-risk: 1.5-2:1
Time commitment: Low

Value investing (long-term):

Strategy:
• Buy undervalued stocks
• Hold for years
• Collect dividends
• Let compound growth work

How to identify:
• P/E below market average (15 vs 20)
• Good dividend (2%+)
• Strong balance sheet
• Boring, stable business

Entry:
• Gradually accumulate position
• Dollar-cost average
• Buy dips
• No rush to get full position

Exit:
• Never, ideally
• Hold for 10+ years
• Sell when overvalued (P/E too high)
• Use for income

Win rate: 80%+
Reward-to-risk: 1-1.5:1 (but over 10 years)
Time commitment: Very low

Short selling:

What it is:
Betting stock will go down.

How it works:
• Borrow shares from broker
• Sell them at current price
• Hope price drops
• Buy back cheaper
• Return shares to broker
• Profit = sell price - buy price - interest/fees

Example:
• Borrow 100 shares of stock X at $100
• Sell for $10,000
• Stock drops to $80
• Buy 100 shares for $8,000
• Return shares to broker
• Profit = $2,000 minus fees/interest

Risks:
• Unlimited loss (stock goes to $1,000)
• Short squeeze (price skyrockets, forced cover)
• High borrow costs (some stocks)
• Margin calls
• Emotions (losses stack fast)

When to short:
• Stock clearly overvalued
• Business model broken
• Fraud evident
• Extreme bubble

Don't short just because down. Most stocks go up eventually.

Pair trading:

Strategy:
• Long overperformer
• Short underperformer
• Profit from relative strength

Example:
• Long Tesla (strong momentum)
• Short Ford (weak momentum)
• Profit if Tesla up + Ford down
• Or Tesla up + Ford flat (Tesla wins)

Reduces market risk:
If market crashes, both stocks fall.
But relative relationship matters.

Sector rotation:

Strategy:
• Move money between sectors based on cycle
• Buy defensive when market weak (utilities, staples)
• Buy aggressive when market strong (tech, growth)
• Rotate quarterly

Indicators:
• Market breadth (more stocks up or down?)
• Sector relative strength (which sectors leading?)
• Economic cycle (recession = defensive)

Dividend arbitrage:

Strategy:
• Buy high-dividend stock before ex-dividend date
• Collect dividend
• Sell post-dividend
• Repeat quarterly

Example:
• Stock pays 4% dividend
• Buy at $100 (record date tomorrow)
• Get $4 dividend
• Stock drops to $99 (ex-dividend adjustment)
• Sell for $99 + $4 dividend = $103
• Profit = $3 minus fees

Reality:
• Sound good but doesn't work in practice
• Stock almost always drops by dividend amount
• Fees eat profit
• Not worth it

Options strategies (advanced):

Covered calls (generate income):
• Own 100 shares
• Sell call option (right for buyer to buy at price)
• Get premium paid to you
• If stock called away, you sell at that price
• Income strategy, mildly bullish

Protective puts (insurance):
• Own stock you love
• Buy put option (right to sell at price)
• If stock crashes, put protects you
• Cost is insurance premium
• Bearish insurance, bullish stocks

Iron condors (sell volatility):
• Sell out-of-money call and put
• Collect premium
• Hope stock stays in range
• Complex, needs experience
• High success rate but small profit

These require deep knowledge of options. Start with stocks first.

Algorithmic trading:

What it is:
Use code to automate trading.

Simple algorithm example:
If RSI < 30 AND price > 200-day MA THEN buy
If RSI > 70 THEN sell

Advanced algorithm:
Machine learning analyzes patterns, predicts

Pros:
• Removes emotion
• Executes perfectly
• Can trade 24/7
• Backtest before live

Cons:
• Overfitting (too specific to past data)
• Markets change
• Competitive (professionals use too)
• Technical knowledge required

Best approach:
Start with manual trading, automate simple rules later.

Backtesting your strategy:

Before risking real money:
• Test strategy on past data
• See what returns would be
• Identify problems
• Refine rules

How to backtest:
• ThinkorSwim (free, limited)
• TradeStation (paid)
• Python libraries (complex)
• Excel spreadsheet (simple but manual)

Common backtesting mistakes:
• Overfitting: Too specific to past
• Survivorship bias: Ignoring dead stocks
• Forward bias: Using future data somehow
• Ignoring costs: Fees and slippage
• Assumptions: Perfect execution never happens

Good backtest:
• 10+ years of data minimum
• Includes bad markets (2008, 2020, 2022)
• Conservative assumptions (slippage, fees)
• Shows drawdowns clearly
• Realistic position sizing

Most strategies work in backtest but fail live.

Why real trading is different:
• Emotions (fear/greed)
• Slippage (worse prices)
• Costs (fees and spreads)
• Market changes (past patterns break)
• Discipline (sticking to plan)

Key to success:
Good strategy + Discipline > Great strategy + Emotional trading

Don't get caught up in complex strategies.

Simple strategies consistently beat complex ones.

Best complex traders still use simple rules.

Your next steps:

1. Master ONE simple strategy
2. Backtest it thoroughly
3. Start with small live account
4. Keep detailed records
5. Follow rules religiously
6. Let it run for 6+ months
7. THEN learn new strategies

Building blocks:
1. Understand brokers ✓
2. Master order types ✓
3. Learn position sizing ✓
4. Control emotions ✓
5. Execute one strategy ✓
6. Eventually: Multiple strategies
7. Eventually: Automated trading

You've learned a lot.

Now comes the hard part: Executing with discipline.

Most traders have knowledge.
Few have discipline.
Be the few.`,
    question: MODULE_4_PRETEST[13]
  }
];
