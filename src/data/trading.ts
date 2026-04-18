// Module 1 content: intro trading concepts — lessons reference TRADING_PRETEST entries for inline quizzes.
export const TRADING_PRETEST = [
  { question: "What does a stock represent?", options: ["A loan", "Fractional ownership", "A physical product", "Nothing"], correctIndex: 1 },
  { question: "What is a stock exchange?", options: ["A digital market to trade stocks", "A bank for companies", "A government tax agency", "A private club"], correctIndex: 0 },
  { question: "What is a 'Bear Market'?", options: ["Prices are rising", "Trading is paused", "Prices are falling", "Only animals can trade"], correctIndex: 2 },
  { question: "What are dividends?", options: ["Bank fees", "A portion of company profits paid to shareholders", "Taxes", "Stock market rules"], correctIndex: 1 },
  { question: "What does Market Capitalization measure?", options: ["The company's debt", "The total value of all a company's shares", "The CEO's salary", "Daily trading volume"], correctIndex: 1 },
  { question: "What is an IPO?", options: ["Internal Profit Organization", "Initial Public Offering", "International Price Order", "Internet Protocol Overload"], correctIndex: 1 },
  { question: "What is a Ticker Symbol?", options: ["A watch brand", "A 1-5 letter abbreviation for a stock (e.g., AAPL)", "A secret code", "The price of a stock"], correctIndex: 1 },
  { question: "What does a Market Order do?", options: ["Buys the stock instantly at the current price", "Waits for a specific price", "Cancels a trade", "Sells everything"], correctIndex: 0 },
  { question: "What does a Limit Order do?", options: ["Limits how much you can lose", "Executes only at a specific price or better", "Stops you from trading", "Buys instantly"], correctIndex: 1 },
  { question: "What is a portfolio?", options: ["A briefcase", "A collection of financial investments", "A single stock", "A bank account"], correctIndex: 1 },
  { question: "Why is diversification important?", options: ["It guarantees profit", "It reduces risk by spreading investments", "It's required by law", "It lowers taxes"], correctIndex: 1 },
  { question: "What does 'Volatility' refer to?", options: ["How loud the trading floor is", "The rate at which the price of a stock increases or decreases", "Company profits", "Number of employees"], correctIndex: 1 },
  { question: "What are 'Blue Chip' stocks?", options: ["Stocks related to poker", "Shares of large, industry-leading companies", "Cheap penny stocks", "Tech startups"], correctIndex: 1 },
  { question: "What is an ETF?", options: ["A basket of securities that trades like a single stock", "Electronic Trading Fee", "Extra Time Fund", "European Trade Federation"], correctIndex: 0 },
  { question: "What is Risk Tolerance?", options: ["How much market risk you can comfortably handle", "A legal document", "The maximum you can invest", "A guarantee against loss"], correctIndex: 0 }
];

export const TRADING_LESSONS = [
  { 
    title: "Lesson 1: What is a Stock?", 
    content: `A stock represents a fractional ownership stake in a corporation. When you buy shares of a company, you become a part-owner of that business, no matter how small your stake.

Example: If a company has 1 million shares outstanding and you own 100 shares, you own 0.01% of that company. As the company grows and becomes more valuable, your shares become more valuable too.

Why buy stocks? When companies are successful, their stock value increases, allowing you to profit. Some stocks also pay dividends (quarterly cash payments) to shareholders. Historically, stocks have returned about 10% annually on average over the long term, making them a key tool for wealth building.

Common misconception: You don't need a lot of money to start. Many brokers let you buy fractional shares, meaning you can invest just $10 if you want.`, 
    question: TRADING_PRETEST[0] 
  },
  { 
    title: "Lesson 2: Stock Exchanges", 
    content: `A stock exchange is a marketplace where shares of companies are bought and sold. Think of it like a digital farmers market, but instead of vegetables, you're trading ownership in businesses.

The two largest US stock exchanges are:
• NYSE (New York Stock Exchange) – founded in 1792, hosts over 3,000 companies including Apple, Microsoft, and Coca-Cola
• NASDAQ – known for tech companies like Google, Amazon, Tesla, and Meta

Other major exchanges worldwide include the LSE (London), Tokyo Stock Exchange, and Shanghai Stock Exchange.

How it works: When you place an order to buy or sell a stock, it goes to the exchange where a matching buyer or seller is found. This happens in milliseconds! The exchange ensures fair pricing and transparent trading for all participants.`, 
    question: TRADING_PRETEST[1] 
  },
  { 
    title: "Lesson 3: Bulls vs. Bears", 
    content: `These terms describe the overall direction and sentiment of the stock market:

Bull Market: A period where stock prices are generally rising and investors are optimistic about the economy. Bulls are optimistic because they "toss the market upward" with their horns. During bull markets, unemployment is low, businesses are profitable, and consumer confidence is high. A famous example: The bull market from 2009-2021 produced some of the highest returns in history.

Bear Market: A period where stock prices are falling 20% or more from recent highs, and investors are pessimistic. Bears are pessimistic because they "swat the market downward" with their paws. During bear markets, unemployment rises, profits decline, and people are afraid to invest. The 2008 financial crisis was a severe bear market where stocks lost 50%+ of their value.

Important perspective: Even in bear markets, long-term investors who keep buying are actually getting deals on stocks. Think of it like a sale – lower prices mean better value.`, 
    question: TRADING_PRETEST[2],
    demo: 'stock-price-chart'
  },
  { 
    title: "Lesson 4: Dividends", 
    content: `A dividend is a payment that some companies make to their shareholders, usually quarterly (four times per year). It's a way companies share profits with the people who own them.

How dividends work: If a company makes $100 million in profit and decides to pay out 50% as dividends, that's $50 million split among all shareholders. If you own 1,000 shares of a company paying $1 per share in annual dividends, you'd receive $1,000 per year.

Types of dividends:
• Cash dividends – Direct payments to your brokerage account
• Stock dividends – Additional shares of the company instead of cash
• Special dividends – One-time large payouts when companies have exceptional profits

Why companies pay dividends: Mature, stable companies (like Coca-Cola, Pepsi, utilities) often use dividends to attract investors seeking steady income. Younger growth companies (like Apple, Microsoft) typically reinvest profits to expand rather than pay dividends.

Pro tip: Dividend aristocrats are companies that have increased dividends for 25+ consecutive years – historically reliable investments.`, 
    question: TRADING_PRETEST[3] 
  },
  { 
    title: "Lesson 5: Market Capitalization", 
    content: `Market Capitalization (Market Cap) is the total value of all a company's shares in the marketplace. It's calculated by multiplying the stock price by the number of outstanding shares.

Formula: Market Cap = Stock Price × Number of Shares Outstanding

Example: If Apple's stock is trading at $180 per share and they have 15 billion shares outstanding:
Market Cap = $180 × 15 billion = $2.7 trillion

Market Cap categories:
• Large-cap (>$10 billion): Established companies like Microsoft, Apple, Coca-Cola. Generally more stable, less volatile
• Mid-cap ($2-10 billion): Growing companies with good track records
• Small-cap ($300M-2B): Smaller, faster-growing companies with higher risk/reward
• Micro-cap (<$300M): Very small companies, very risky, very high growth potential

Why it matters: Market cap helps you understand company size and risk. Large-cap stocks are generally safer, while small-cap stocks offer more growth potential but with more volatility.`, 
    question: TRADING_PRETEST[4] 
  },
  { 
    title: "Lesson 6: IPOs", 
    content: `An Initial Public Offering (IPO) is the moment when a private company first offers shares to the general public, transitioning from private to public ownership.

Before IPO: A company is private, owned by founders, employees, and perhaps some venture capital investors. Shares can't be bought by the general public.

During IPO: The company hires an investment bank (like Goldman Sachs or Morgan Stanley) to help set an initial price and market the shares. The company undergoes extensive scrutiny – SEC reviews their financials, executives present to investors, and a price is set based on demand.

After IPO: Shares can be freely bought and sold on stock exchanges. The company becomes accountable to the public and must report financials quarterly.

Famous IPOs:
• Google (2004): IPO price $85, now worth $170+
• Facebook (2012): IPO price $38, now worth $450+
• Airbnb (2020): IPO price $68, now worth $250+

Why go public? IPOs raise massive capital for expansion, provide liquidity for early investors, and increase brand visibility. But companies must give up some privacy and autonomy.`, 
    question: TRADING_PRETEST[5] 
  },
  { 
    title: "Lesson 7: Ticker Symbols", 
    content: `A ticker symbol is a unique 1-5 letter abbreviation assigned to each publicly traded company. It's the shorthand name for a stock.

Why "ticker"? In the 1800s, stock prices were printed on paper tape that made a ticking sound – hence "ticker tape."

Common examples:
• AAPL = Apple
• MSFT = Microsoft
• GOOGL = Google (Class A), GOOG = Google (Class C)
• TSLA = Tesla
• BRK.B = Berkshire Hathaway (Class B)
• IBM = International Business Machines

How to find ticker symbols: Search Google "Apple ticker symbol" or use financial sites like Yahoo Finance, Google Finance, or your brokerage.

Why they matter: When you want to buy a stock, you search by ticker symbol. Charts, quotes, news, and research are organized by ticker. Knowing the ticker is essential for any trader.

Pro tip: Some tickers are memorable acronyms. Netflix is NFLX, PayPal is PYPL, and Amazon is AMZN – they're designed to be easy to remember.`, 
    question: TRADING_PRETEST[6] 
  },
  { 
    title: "Lesson 8: Market Orders", 
    content: `A Market Order is an instruction to buy or sell a stock immediately at the best available current price, without any conditions.

How it works:
1. You decide to buy 100 shares of Apple
2. You submit a market order
3. It executes instantly at whatever price someone is selling at right now
4. Shares appear in your account in seconds

Pros of Market Orders:
• Instant execution – You're guaranteed the trade will go through
• Simple – Just decide to buy/sell and you're done
• Predictable – Good for liquid stocks with lots of buyers/sellers

Cons of Market Orders:
• Price uncertainty – In fast-moving markets, your actual price might be slightly higher/lower than you expected
• Slippage – Especially with less-popular stocks, the price between you clicking and execution might change significantly
• Not ideal for large trades – Buying 1 million shares at market price could move the market against you

When to use: Market orders are ideal when you want to quickly enter or exit a position and price isn't critically important. Great for beginners.`, 
    question: TRADING_PRETEST[7],
    demo: 'order-book'
  },
  { 
    title: "Lesson 9: Limit Orders", 
    content: `A Limit Order is an instruction to buy or sell a stock ONLY at a specific price or better. You set the price conditions.

How it works:
1. You submit a limit order to BUY 100 shares of Apple AT OR BELOW $150
2. The order sits in the market waiting
3. When someone is selling at $150 or less, your order executes
4. If the price never drops to $150, your order never fills (you don't buy)

Limit Order types:
• Buy limit: "Buy only at $150 or lower" – You set the maximum you'll pay
• Sell limit: "Sell only at $200 or higher" – You set the minimum you'll accept

Pros of Limit Orders:
• Price control – You decide the exact price you're willing to buy/sell at
• Protection – If a stock gaps down due to bad news, your limit order prevents you from buying at a terrible price

Cons of Limit Orders:
• No guarantee of execution – If the price never hits your limit, you might miss the opportunity
• Slower – Takes time to fill, sometimes never fills at all
• Better for patient investors

When to use: Limit orders are for investors with specific price targets or those wanting to buy during dips. Popular with experienced traders.`, 
    question: TRADING_PRETEST[8] 
  },
  { 
    title: "Lesson 10: Portfolios", 
    content: `Your investment portfolio is the complete collection of all financial assets that you own. It's like your financial toolbox containing different types of investments.

What goes in a portfolio?
• Stocks (ownership in companies)
• Bonds (loans you make to companies/governments, they pay you interest)
• ETFs (bundles of stocks and bonds)
• Mutual Funds (professionally managed collections)
• Cash and savings accounts
• Real estate
• Cryptocurrencies
• Commodities (gold, oil, etc.)

Sample portfolio allocation for a 30-year-old:
• 70% stocks (growth)
• 20% bonds (stability)
• 10% cash (emergency fund)

Portfolio concepts:
• Diversification – Spreading money across different assets to reduce risk
• Rebalancing – Adjusting your allocation yearly (if stocks grew to 80%, buy bonds to get back to 70%)
• Asset allocation – The percentage split between different asset types
• Sector allocation – How much in technology vs healthcare vs energy, etc.

Your first portfolio might be simple: Just a few stocks or an ETF. As it grows, you'll add more complexity and diversification.`, 
    question: TRADING_PRETEST[9],
    demo: 'portfolio-allocation'
  },
  { 
    title: "Lesson 11: Diversification", 
    content: `Diversification is the investment principle of spreading your money across many different investments to reduce risk. The goal: "Don't put all your eggs in one basket."

Why diversify?
• If you own only Tesla stock and Tesla crashes 50%, you lose 50% of your money
• If you own 10 stocks and one crashes, you only lose about 10%
• Different sectors perform differently in different economic conditions

Types of diversification:

1. Across sectors: Own tech, healthcare, finance, energy stocks
2. Across company sizes: Mix large-cap, mid-cap, small-cap stocks
3. Across asset types: Stocks, bonds, real estate, etc.
4. Geographically: US stocks, international stocks, emerging markets

How to diversify easily:
• Buy an ETF like VOO (covers 500 large US companies) – instant diversification
• Dollar-cost averaging: Invest $500/month for 10 months rather than $5,000 at once
• Rebalance annually: Check your allocation and restore balance

Historical perspective: In the 2008 financial crisis, investors with diversified portfolios lost about 30-40%. Those with only stocks lost 50%+. Those with bonds and stocks lost only 20-30%. Diversification saved portfolios.

Rule of thumb: You need at least 15-20 stocks to be truly diversified. With fewer, a single company's collapse can devastate your portfolio.`, 
    question: TRADING_PRETEST[10],
    demo: 'diversification'
  },
  { 
    title: "Lesson 12: Volatility", 
    content: `Volatility measures how much a stock's price swings up and down. High volatility = big price swings = high risk and high potential reward.

Understanding volatility:

Stock A: Trading between $95-105 per month (10% swings) – Low volatility
Stock B: Trading between $80-120 per month (40% swings) – High volatility

Low volatility stocks:
• Utility companies, consumer staples, established banks
• Price relatively stable
• Good for conservative investors
• Lower potential returns

High volatility stocks:
• Tech startups, biotech, emerging companies
• Price can swing wildly
• Good for aggressive investors with high risk tolerance
• Higher potential returns

Historical volatility vs Implied volatility:
• Historical volatility – Based on actual past price swings
• Implied volatility – Market's expectation of future price swings (used in options pricing)

During bull markets: Volatility often decreases – Everyone's confident, prices rise smoothly
During bear markets: Volatility spikes – Everyone's scared, prices whip around

Pro tip: "When there is fear in the market, there is opportunity." High volatility can create buying opportunities for patient investors who know what they're doing.

Common volatility measurement: Beta
• Beta = 1.0 means the stock moves with the market
• Beta < 1.0 means the stock is less volatile than the market
• Beta > 1.0 means the stock is more volatile than the market (riskier)`, 
    question: TRADING_PRETEST[11] 
  },
  { 
    title: "Lesson 13: Blue Chip Stocks", 
    content: `Blue Chip stocks are shares of large, nationally recognized, well-established, and financially sound companies. The term comes from poker – blue chips are the most valuable chips.

Characteristics of Blue Chip stocks:
• Market cap: Usually $10+ billion
• Track record: 20+ years of consistent profitability
• Stable dividends: Often pay reliable dividends for decades
• Brand recognition: Household names
• Less volatile: Generally safer than smaller companies
• Slower growth: More stable returns, less explosive upside

Examples of Blue Chips:
• Technology: Apple, Microsoft, Google, Amazon
• Finance: JPMorgan Chase, Berkshire Hathaway
• Consumer: Coca-Cola, Procter & Gamble, Walmart
• Healthcare: Johnson & Johnson, Pfizer

Why invest in Blue Chips?
• Safety: Unlikely to go bankrupt
• Predictability: Consistent earnings and dividends
• Liquidity: Easy to buy/sell with tight bid-ask spreads
• Dividend income: Many pay steady dividends for decades

Blue Chip downside:
• Slower growth: Don't typically double in a few years like tech startups
• Mature markets: Limited room for explosive expansion
• Higher prices: Already well-priced, less room for upside surprise

Strategy: Many investors build a foundation with Blue Chips and add growth stocks for potential home runs. Blue Chips provide the stability while growth stocks provide the excitement.`, 
    question: TRADING_PRETEST[12] 
  },
  { 
    title: "Lesson 14: ETFs", 
    content: `An Exchange-Traded Fund (ETF) is a bundle of many different stocks (or bonds, or other assets) packaged together into a single security that you can buy like a regular stock.

How ETFs work:
• A company packages 500 stocks together into 1 fund
• You can buy 1 share of the ETF instead of 500 individual stocks
• When the 500 stocks go up, your ETF goes up
• You get instant diversification with one purchase

Popular ETFs:
• VOO (Vanguard S&P 500): Contains 500 largest US companies
• QQQ (Nasdaq-100): Contains 100 largest tech companies
• SPY (SPDR S&P 500): Similar to VOO, also contains 500 largest US companies
• IVV (iShares Core S&P 500): Another S&P 500 tracker

ETF advantages:
• Diversification: Own hundreds of companies with one trade
• Low cost: Expense ratios typically 0.03-0.20% per year
• Tax efficient: Structure minimizes capital gains taxes
• Easy to trade: Buy/sell during market hours like regular stocks
• Transparent: You always know what you own

ETF disadvantages:
• Lower returns than hand-picked winners: You get average market returns (which is actually good!)
• Can't pick winners: Own the losers too

ETF strategy: Many beginners start with ETFs because they're safe, easy, and diversified. As you learn, you can pick individual stocks while keeping ETFs as your core holdings.`, 
    question: TRADING_PRETEST[13] 
  },
  { 
    title: "Lesson 15: Risk Tolerance", 
    content: `Your risk tolerance is a measure of how much emotional and financial pain you can handle when your investments lose value. It determines your investment strategy.

Three risk tolerance levels:

Conservative (Low risk tolerance):
• You panic when stocks drop 10% and want to sell
• You want steady, predictable returns
• You're close to retirement and can't afford big losses
• Ideal allocation: 20% stocks, 80% bonds/cash
• Expected return: 3-5% annually

Moderate (Medium risk tolerance):
• You accept that stocks will fluctuate but trust the long-term trend
• You're 20+ years from retirement
• You can stomach a 30% loss without panicking
• Ideal allocation: 60% stocks, 40% bonds
• Expected return: 6-8% annually

Aggressive (High risk tolerance):
• You're seeking maximum growth and not worried about short-term drops
• You're young (under 30) with decades to recover from losses
• You understand that markets crash 50% every 10-20 years
• Ideal allocation: 90-100% stocks
• Expected return: 8-12% annually

How to determine your tolerance:
• Question: "If your $10k investment drops to $5k, would you panic and sell?" (If yes, conservative)
• Time horizon: Younger = higher tolerance
• Financial situation: Emergency fund matters more than investments
• Past experience: Have you been through a market crash?

Critical insight: Risk tolerance is NOT about how smart you are – it's about your personality and life situation. Even smart investors with low tolerance shouldn't be 100% stocks. Conversely, young investors can afford high volatility.

Action: Match your portfolio to your tolerance, not some generic advice. Losing sleep over investments is a sign your allocation doesn't match your tolerance.`, 
    question: TRADING_PRETEST[14],
    demo: 'risk-tolerance'
  }
];