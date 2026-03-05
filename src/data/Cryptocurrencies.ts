export const CRYPTOCURRENCIES_PRETEST = [
  { question: "What is blockchain?", options: ["A type of stock market", "A distributed ledger technology that records transactions across many computers", "A block of currencies", "A bank's security system"], correctIndex: 1 },
  { question: "What is Bitcoin?", options: ["A currency used in banks", "The first and largest cryptocurrency", "A type of blockchain", "A payment method"], correctIndex: 1 },
  { question: "Who created Bitcoin?", options: ["The Federal Reserve", "A mysterious person or group named Satoshi Nakamoto", "Mark Zuckerberg", "Elon Musk"], correctIndex: 1 },
  { question: "What is mining in cryptocurrency?", options: ["Extracting coins from the ground", "Process of validating transactions and creating new coins", "A type of trading", "Storing cryptocurrency"], correctIndex: 1 },
  { question: "What is a wallet in crypto?", options: ["Your bank account", "A digital tool that holds and manages cryptocurrency", "Physical money storage", "A crypto exchange"], correctIndex: 1 },
  { question: "What is Ethereum?", options: ["A coin similar to Bitcoin", "A blockchain platform that allows smart contracts and decentralized apps", "A type of trading strategy", "A wallet service"], correctIndex: 1 },
  { question: "What is a smart contract?", options: ["A traditional legal contract", "Self-executing code that runs on blockchain when conditions are met", "A type of cryptocurrency", "A trading agreement"], correctIndex: 1 },
  { question: "What is DeFi?", options: ["A type of cryptocurrency", "Decentralized Finance - financial services using blockchain", "A digital wallet", "A trading platform"], correctIndex: 1 },
  { question: "What is an altcoin?", options: ["A gold coin", "Any cryptocurrency other than Bitcoin", "A type of blockchain", "A mining pool"], correctIndex: 1 },
  { question: "What is volatility in crypto?", options: ["A feature of computers", "Rapid price fluctuations typical of cryptocurrencies", "A mining technique", "A type of wallet"], correctIndex: 1 },
  { question: "What is a crypto exchange?", options: ["A person who exchanges currencies", "A platform where you buy and sell cryptocurrencies", "A type of blockchain", "A mining operation"], correctIndex: 1 },
  { question: "What is a private key?", options: ["A hidden password for a wallet", "Secret code that gives you access and control of your cryptocurrency", "A type of Bitcoin", "A mining tool"], correctIndex: 1 },
  { question: "What is a public key?", options: ["A secret code", "A wallet address you can share publicly to receive cryptocurrency", "A type of blockchain", "A mining reward"], correctIndex: 1 },
  { question: "What is halving?", options: ["Losing half your money", "Periodic event where mining rewards are cut in half", "A type of wallet", "A trading strategy"], correctIndex: 1 },
  { question: "What is market cap in crypto?", options: ["The capital of a mining company", "Price per coin × Total coins in circulation", "The amount miners earn", "The size of a crypto exchange"], correctIndex: 1 },
  { question: "What is staking in crypto?", options: ["Making bets on price", "Locking up cryptocurrency to validate transactions and earn rewards", "A type of mining", "Storing coins long-term"], correctIndex: 1 },
  { question: "What is a fork?", options: ["A type of hardware", "A change to blockchain code creating a new version", "A wallet type", "A trading tool"], correctIndex: 1 },
  { question: "What is a rug pull?", options: ["Pulling out a rug", "Scam where creators abandon a project and steal investor funds", "A mining technique", "A type of cryptocurrency"], correctIndex: 1 },
  { question: "What is HODL?", options: ["A technical term", "Strategy of holding cryptocurrency long-term instead of trading frequently", "A type of wallet", "A mining reward"], correctIndex: 1 },
  { question: "What is KYC in crypto?", options: ["A cryptocurrency", "Know Your Customer - identity verification required by exchanges", "A type of blockchain", "A mining pool"], correctIndex: 1 },
  { question: "What is the total supply of Bitcoin?", options: ["Unlimited", "1 million coins", "21 million coins", "100 million coins"], correctIndex: 2 }
];

export const CRYPTOCURRENCIES_LESSONS = [
  {
    title: "Lesson 1: What is Cryptocurrency?",
    content: `Cryptocurrency is digital money that uses cryptography (encryption) to secure transactions and control the creation of new units. It exists only on the internet, not as physical coins or bills.

Key characteristics:
• Decentralized: Not controlled by any government or bank
• Digital: Exists only as computer code on the internet
• Secure: Uses cryptography to prevent fraud
• Transparent: All transactions are recorded publicly (on blockchain)

Why it was created:
In 2008, during the financial crisis, distrust in banks was at an all-time high. Someone (or a group) named Satoshi Nakamoto invented Bitcoin as a way to send money directly person-to-person without needing a bank as intermediary.

Traditional payment system vs Crypto:
Traditional: You → Bank A → Bank B → Recipient (takes 1-3 days, fees, requires trust in banks)
Crypto: You → Recipient (takes 10 minutes, lower fees, direct peer-to-peer)

Types of cryptocurrency:
• Bitcoin: The original, store of value ("digital gold")
• Ethereum: Platform for smart contracts and applications
• Altcoins: Thousands of other cryptocurrencies (Ripple, Litecoin, Dogecoin, etc.)

Current adoption:
• Over 2.1 billion cryptocurrency users worldwide
• Bitcoin and Ethereum are the most established
• Some countries (El Salvador) have adopted Bitcoin as legal tender
• Most businesses are starting to accept crypto payments

Risks:
• Highly volatile (can lose 50%+ of value quickly)
• Regulatory uncertainty (laws still being written)
• Scams and fraud are common
• Technology is complex for beginners`,
    question: CRYPTOCURRENCIES_PRETEST[0]
  },
  {
    title: "Lesson 2: Bitcoin - The First Cryptocurrency",
    content: `Bitcoin is the first and most famous cryptocurrency, created in 2009 by Satoshi Nakamoto (whose true identity remains unknown).

Bitcoin basics:
• Total supply: 21 million coins (will never be more)
• Currently: ~19.5 million in circulation
• Price: Volatile, has ranged from $0.01 to $69,000+ per coin
• Confirmed transactions: Over 700+ million since 2009

What makes Bitcoin special:
1. First to solve the "double-spending problem" - prevented digital money from being copied
2. Truly decentralized - no company or government controls it
3. Limited supply - scarcity gives it value (like gold)
4. Immutable ledger - transactions can't be reversed or changed

How Bitcoin works:
1. You send 1 Bitcoin to recipient
2. Your transaction goes into the network
3. Miners validate and bundle transactions
4. After validation, transaction is recorded permanently on the blockchain
5. Recipient receives the Bitcoin

Bitcoin mining:
Miners use powerful computers to solve complex math problems. The first to solve wins:
• The right to add the next block to blockchain
• A reward of newly created Bitcoin (~6.25 per block, halves every 4 years)
• Transaction fees from that block

Why mine?
Mining secures the network by making it expensive/difficult to attack. Miners are rewarded for this security work.

Bitcoin halvings:
Every 210,000 blocks (~4 years), mining rewards are cut in half:
• 2009: 50 Bitcoin per block
• 2012: 25 Bitcoin per block
• 2016: 12.5 Bitcoin per block
• 2020: 6.25 Bitcoin per block
• 2024: 3.125 Bitcoin per block

This scarcity drives long-term value increase.

Pros:
• Decentralized and transparent
• Limited supply increases scarcity value
• Global, censorship-resistant
• Can be sent to anyone without intermediary

Cons:
• Extremely volatile
• Slow transactions (10 min average)
• Energy-intensive mining
• Irreversible transactions (can't dispute charges)`,
    question: CRYPTOCURRENCIES_PRETEST[1]
  },
  {
    title: "Lesson 3: Ethereum and Smart Contracts",
    content: `Ethereum was created in 2015 by programmer Vitalik Buterin to go beyond just digital money. It introduced "smart contracts" - code that runs on blockchain.

Key differences from Bitcoin:
Bitcoin: Digital currency, store of value ("digital gold")
Ethereum: Platform for applications, with its own currency (Ether/ETH)

Smart contracts:
Imagine a vending machine - you insert money, it automatically dispenses product without human intermediary.

Smart contracts do this with code:
• Defined conditions: "If A happens and B is true, then do C"
• Automatic execution: When conditions are met, code runs automatically
• Immutable: Can't be changed once deployed
• Trustless: No middleman needed

Real-world examples:

Insurance: Auto insurance smart contract
Traditional: You file claim → Insurance company reviews (takes weeks) → They approve/deny → Funds transfer
Smart contract: Sensor detects accident → Code automatically pays you → Funds appear in wallet instantly

Supply chain: Product authenticity
Traditional: Middlemen verify if product is real → Can be faked
Smart contract: Every step recorded on blockchain → Anyone can verify the entire history

Ethereum applications:
DeFi (Decentralized Finance):
• Lending: Lend ETH to earn interest without bank
• Borrowing: Borrow crypto using other crypto as collateral
• Trading: Swap cryptocurrencies directly
• Yield farming: Deposit crypto to earn returns

NFTs (Non-Fungible Tokens):
• Digital art ownership verified on blockchain
• Each NFT is unique (like signed artwork)
• Proves you own digital asset

DAOs (Decentralized Autonomous Organizations):
• Organizations run by smart contracts, not CEO
• Members vote on decisions
• Funds managed by code, not bank

Layer 2 solutions:
Ethereum processes 15-20 transactions/second (slow).
Layer 2 solutions process thousands of transactions/second with lower fees:
• Polygon
• Arbitrum
• Optimism

ETH vs BTC:
Bitcoin: Fixed supply, limited functionality, "store of value"
Ethereum: Complex applications, growing uses, constantly evolving`,
    question: CRYPTOCURRENCIES_PRETEST[2]
  },
  {
    title: "Lesson 4: How Blockchain Works",
    content: `Blockchain is a distributed ledger - think of it as a shared spreadsheet that no single entity controls.

The basic concept:
Instead of one bank maintaining a ledger, thousands of computers ("nodes") each hold an identical copy. When someone makes a transaction, all copies update in agreement.

How a blockchain transaction works:

Step 1: Initiation
You send 1 Bitcoin to your friend. Your wallet creates a transaction containing:
• Sender's public key (you)
• Recipient's public key (friend)
• Amount (1 Bitcoin)
• Digital signature (proves it's from you)

Step 2: Broadcast
Transaction is broadcast to all 15,000+ Bitcoin nodes worldwide.

Step 3: Validation
Nodes check:
• Is sender's signature valid?
• Does sender actually have 1 Bitcoin?
• Is transaction format correct?

Step 4: Mempool
Valid transaction enters mempool (waiting area with ~100,000 pending transactions). It waits to be included in a block.

Step 5: Mining
Miners select transactions from mempool and bundle them. A miner solves a complex math problem (Proof of Work).

Step 6: Block creation
Winner creates new block containing:
• 2,000-3,000 transactions
• Timestamp
• Hash of previous block (creates the "chain")
• Miner's signature

Step 7: Distribution
New block is broadcast to all nodes. Each node independently verifies all transactions in the block.

Step 8: Confirmation
All nodes add block to their copy of blockchain. Transaction is now confirmed. Your friend receives 1 Bitcoin. They can't spend it for ~60 minutes (6 confirmations).

Key concepts:

Hash: A cryptographic fingerprint of data
• Even 1-bit change in data completely changes the hash
• Impossible to reverse (can't figure out original data from hash)
• Creates immutability

Proof of Work: The math puzzle miners solve
• Difficulty adjusts every 2 weeks
• Takes ~10 minutes to solve on average
• Using this proof, everyone can verify the block is valid

Merkle tree: Transactions organized in a tree structure
• Each transaction is hashed
• Hashes are paired and hashed again
• Final result (Merkle root) represents all transactions
• Proves all transactions in block without storing each individually

Double-spending prevention:
Problem: Digital money can be copied. How prevent same coin being spent twice?
Solution: The blockchain is the truth. Only first transaction recorded on blockchain is valid. Subsequent attempts are rejected.

Consensus mechanism:
With thousands of nodes, how do they agree on truth?
• Proof of Work (Bitcoin): Majority of computing power validates
• Proof of Stake (Ethereum 2.0): Owners of coins validate (more energy efficient)
• Other mechanisms: Proof of Authority, Proof of History, etc.`,
    question: CRYPTOCURRENCIES_PRETEST[3]
  },
  {
    title: "Lesson 5: Cryptocurrency Wallets",
    content: `A crypto wallet is software that stores your cryptocurrency and allows you to send/receive funds.

How wallets work:
Your wallet contains:
• Private key: Secret code only you know (like password on steroids)
• Public key: Derived from private key, used to receive funds
• Address: Human-readable version of public key (like account number)

Analogy:
Public key = Your email address (you share with anyone who wants to email you)
Private key = Your email password (you NEVER share)
Address = Your bank account number (safe to share, but only for receiving)

Losing your private key = losing your money forever (no recovery possible).

Types of wallets:

Hot wallets (Online, connected to internet):
• Web wallets: Coinbase, Kraken, Binance
• Mobile wallets: MetaMask, Trust Wallet, Phantom
• Desktop wallets: Bitcoin Core, Exodus

Pros: Easy to use, instant transactions, convenient
Cons: More vulnerable to hacking, less control

Cold wallets (Offline, not connected to internet):
• Hardware wallets: Ledger, Trezor
• Paper wallets: Private key printed on paper
• Air-gapped computers: Computer used only for crypto, never online

Pros: Maximum security, immune to most hacks
Cons: Slower to access, harder to use, higher cost

Wallet types explained:

Self-custody wallet: You control the private key
• You own and control everything
• If you lose the key, funds are lost forever
• Full responsibility on you

Custodial wallet: Exchange controls the private key
• Convenient (exchange manages everything)
• Less secure (exchange can be hacked/exit-scammed)
• Better insurance (some exchanges insure funds)

Multi-signature wallet: Multiple keys needed to authorize transaction
• Needs 2-of-3 keys to move funds (or other combinations)
• Even if 1 key compromised, funds safe
• Used by institutions for large funds

Best practices:

For small amounts (<$1,000): Use hot wallet (Coinbase app, MetaMask)
For medium amounts ($1,000-$10,000): Use hardware wallet (Ledger ~$50)
For large amounts (>$10,000): Use cold storage + multi-sig

Never:
• Share your private key with anyone
• Type private key into websites
• Store in screenshots or photos
• Keep only on exchange

Security tip: Use a 12-24 word seed phrase (backup). If you lose your device, you can recover with seed phrase on any wallet.`,
    question: CRYPTOCURRENCIES_PRETEST[4]
  },
  {
    title: "Lesson 6: Altcoins and Tokens",
    content: `After Bitcoin proved the concept, thousands of alternative cryptocurrencies ("altcoins") were created.

Why so many?
Each altcoin aims to solve specific problems:
• Faster transactions (Litecoin, Bitcoin Cash)
• More features (Ethereum, Cardano)
• Different uses (Chainlink for data, Ripple for banking)
• Lower fees (various Layer 2 tokens)

Major altcoins (by market cap):

Ethereum (ETH): Platform for smart contracts - huge ecosystem
Binance Coin (BNB): Native token of Binance exchange
XRP (Ripple): For fast international payments
Solana (SOL): Fast, low-cost blockchain platform
Polkadot (DOT): Interoperability between blockchains

How new tokens are created:

ICO (Initial Coin Offering): Like an IPO for crypto
• Team raises funds by selling new tokens
• Common in 2017-2018 (many were scams)
• SEC now regulates ICOs more strictly

Airdrops: Free tokens given to wallet holders
• Projects airdrop tokens to early adopters
• Way to bootstrap user base

Mining/Staking: Create new tokens through validation
• Proof of Work: Create by mining
• Proof of Stake: Create by staking coins

Token types:

Utility tokens: Give access to service
• Example: ETH used for Ethereum transactions
• Used for transaction fees or accessing DeFi

Governance tokens: Let holders vote on project decisions
• Example: USDC, AAVE, UNI
• Holders vote on protocol changes
• Incentivizes community involvement

Stablecoins: Designed to maintain fixed price (usually $1)
• USDT, USDC, DAI
• Used for trading and lending
• Less volatile than other crypto

Security tokens: Represent ownership (stocks, bonds)
• Subject to securities regulations
• Still emerging market

Evaluating altcoins:

Team: Do they have experience? Track record?
Use case: Does it solve a real problem?
Adoption: How many users/developers?
Competition: How is it better than alternatives?
Supply: Is total supply limited? Who controls it?
Roadmap: What's their plan for future?

Red flags (potential scams):
• No doxxed team (anonymous founders)
• Unrealistic promises ("guaranteed 1000x returns")
• Lack of technical information
• Heavy marketing but no actual product
• Celebrity endorsements (often paid promotion)
• Copy-paste whitepaper from other projects
• High fees or locked liquidity

Remember: Most altcoins fail. Bitcoin has survived 14+ years. Most new projects die within 1-2 years.`,
    question: CRYPTOCURRENCIES_PRETEST[5]
  },
  {
    title: "Lesson 7: Decentralized Finance (DeFi)",
    content: `DeFi (Decentralized Finance) removes middlemen from financial services using blockchain and smart contracts.

Traditional finance vs DeFi:

Traditional:
• Want loan? Apply to bank → Wait days → Pay origination fee → Bank approves/denies
• Wants interest? Put in savings account → Get 0.01% at bank → Bank uses your money to earn 5%

DeFi:
• Want loan? Send crypto to smart contract → Instantly get loan → Pay interest directly to lenders
• Want interest? Deposit crypto to protocol → Earn 3-8% interest → Lenders paid directly (no middleman)

DeFi protocols:

Lending (Aave, Compound):
• Deposit ETH → Earn 4% interest
• Borrow DAI against your ETH
• Interest goes directly to depositors (not to Aave)
• Rates determined by supply/demand (not company)

Decentralized Exchanges (Uniswap, Curve):
• Swap ETH for USDC directly (no traditional exchange)
• Trade any token that exists on blockchain
• Liquidity providers earn trading fees
• No KYC or account restrictions

Yield farming:
• Deposit crypto to earn rewards
• "Farm" return rates of 10-100%+
• High returns = high risk
• Risks: Smart contract bugs, impermanent loss

Staking:
• Lock up crypto to validate transactions
• Earn new tokens as reward
• Ethereum staking: 3-5% returns currently
• Less risky than farming

Derivatives (Perpetual futures):
• Trade leverage positions (bet with borrowed money)
• Up to 125x leverage on some platforms
• Can amplify gains AND losses
• Most people lose money on leverage

Advantages of DeFi:
• No middleman = lower fees
• 24/7 access (no banking hours)
• Transparent (all code is public, anyone can audit)
• Programmable (combine protocols for complex strategies)
• Permissionless (anyone can use, no account needed)

Risks of DeFi:
• Smart contract bugs can result in total loss
• Extreme volatility
• Complexity (easy to make mistakes)
• Impermanent loss (if you provide liquidity)
• Rug pulls (creators steal funds)
• Government regulation still uncertain

Current state:
• $50+ billion locked in DeFi protocols
• Growing rapidly but still experimental
• Ethereum dominates, but growing on Solana, Polygon, Arbitrum

Best practices:
• Start small
• Use audited protocols (check CertiK, OpenZeppelin audits)
• Understand what you're doing
• Don't use leverage until experienced
• Diversify across protocols`,
    question: CRYPTOCURRENCIES_PRETEST[6]
  },
  {
    title: "Lesson 8: Trading and Volatility",
    content: `Cryptocurrency trading is extremely different from stock trading due to volatility and 24/7 markets.

Crypto market characteristics:

Always open: Crypto trades 24/7/365 (no market close)
Volatile: Bitcoin can move 10%+ in a day (stocks rarely do 2%)
Leverage available: Many exchanges let you trade on margin/leverage
Highly speculative: No earnings reports, company fundamentals less relevant
Emotional: Fear and greed drive prices more than fundamentals

Volatility examples:

Bitcoin price history:
• 2011: $1 to $30 to $2 (back down 95%+)
• 2017: $1,000 to $19,000 (1,900% up)
• 2018: $19,000 to $3,500 (82% down)
• 2020: $6,500 to $69,000 (956% up)
• 2022: $69,000 to $16,000 (77% down)
• 2023: $16,000 to $44,000 (173% up)

This volatility creates both opportunity and risk.

Trading strategies:

Day trading: Buy and sell within a day
• Pros: Try to profit from daily swings
• Cons: 90%+ of day traders lose money, fees eat profits
• Not recommended for beginners

Swing trading: Hold for days/weeks
• Try to catch waves in price action
• Requires technical analysis knowledge
• Higher success rate than day trading
• Still majority of traders lose

Position trading: Hold for months/years
• Ride long-term trends
• Requires less active management
• Let compound growth work
• Better success rate for most people

Dollar-cost averaging (DCA):
• Invest fixed amount regularly (e.g., $100/week)
• Reduces impact of buying at peak prices
• Removes emotion from timing
• Best strategy for most people

Hodling (Hold On for Dear Life):
• Buy and hold long-term
• Ignore price swings
• Historically 7-year holders profitable
• Requires strong conviction and emotional control

Technical analysis in crypto:
Some traders use charts to identify trends:
• Support and resistance levels
• Candlestick patterns
• Moving averages
• Volume analysis

Reality: Technical analysis has no scientific basis. Your success depends more on:
• Luck (market conditions)
• Timing the market correctly
• Managing risk properly
• Controlling emotions

Fundamental analysis:
• Check project adoption metrics
• Evaluate team and roadmap
• Understand technology improvements
• Compare to competing projects

This is more reliable than technical analysis but still difficult.

Risk management:

Position sizing: Only risk what you can afford to lose
• If wrong, what happens to your portfolio?
• Never put more than 5-10% of portfolio in single trade

Stop losses: Set price where you exit if wrong
• Prevents catastrophic losses
• Protects emotions
• Most important risk management tool

Profit taking: Set target price and exit profitably
• Lock in gains
• Don't get greedy
• "No one ever went broke taking profits"

Leverage (margin) trading:
• Trade with borrowed money
• 10x leverage = trade $10,000 with $1,000
• Amplifies both gains and losses
• One mistake = total loss + you owe money
• Not recommended unless professional`,
    question: CRYPTOCURRENCIES_PRETEST[7]
  },
  {
    title: "Lesson 9: Crypto Exchanges and Security",
    content: `A crypto exchange is where you buy/sell cryptocurrency, similar to stock brokers but for crypto.

Major exchanges:

Centralized Exchanges (CEX):

Coinbase:
• User-friendly for beginners
• High fees (1.5-2%)
• Highly regulated, based in US
• Good for starting out

Kraken:
• Lower fees (0.2-0.8%)
• Slightly more technical interface
• Good reputation, high security
• US and global coverage

Binance:
• Largest exchange by volume
• Lowest fees (0.1-0.2%)
• Global coverage
• More regulatory issues

Bybit, OKEx: Futures and derivatives focused

Decentralized Exchanges (DEX):
• Uniswap: Trade Ethereum tokens
• 1Inch: Aggregates prices across multiple DEX
• Curve: Specialized for stablecoins

Advantages of centralized: Easy to use, good customer service, more regulated
Advantages of decentralized: No KYC needed, no custody risk, fully non-custodial

Exchange risks:

Hacking:
• Centralized exchanges have been hacked (Mt. Gox, QuadrigaCX)
• Private exchange operators stealing funds
• Smart contract bugs in DEX

Exit scams:
• Founders disappear with customers' funds
• Not all exchanges are trustworthy

Freezing accounts:
• Exchange can freeze your account (government request)
• Can't access funds until issue resolved

Market manipulation:
• Low-volume coins subject to pump and dumps
• Fake trading volume (wash trading)
• Market makers manipulating prices

Security best practices:

Don't keep large amounts on exchange:
• Use exchange only for trading
• Transfer winnings to personal wallet
• Cold storage for long-term holding

Enable 2-factor authentication (2FA):
• Use authenticator app (Google Authenticator, Authy)
• SMS 2FA is less secure (can be SIM-swapped)
• Hardware key is most secure (Yubikey)

Use strong, unique passwords:
• 16+ characters, mix of types
• Different password for each exchange
• Use password manager (1Password, Bitwarden)

Avoid phishing:
• Bookmark exchanges (don't use search results)
• Check URLs carefully (phishing sites look identical)
• Never click links in emails
• Don't share seed phrase or passwords

Verify wallets before sending:
• Copy-paste addresses
• Check 2-3 characters don't match
• Malware can change clipboard content
• Send small test transaction first

Transaction types:

Spot trading: Buy coin at current price
• Instant settlement
• Lowest fees
• Best for beginners

Margin trading: Borrow funds to trade
• Leverage up to 10-100x
• Pay interest on borrowed funds
• Liquidation risk (lose more than you invested)

Futures/Perpetuals: Bet on price direction
• Can go long (bet price up) or short (bet down)
• Leverage up to 125x on some platforms
• Most traders lose money here

Requirements (KYC):

Most exchanges require Know Your Customer (KYC):
• Government ID
• Proof of address
• Sometimes source of funds verification

Benefits of KYC:
• Legal compliance
• Protects against money laundering
• Enables withdrawals (FIAT conversion)

Drawbacks:
• Privacy concerns
• Kyc required before you can withdraw to bank`,
    question: CRYPTOCURRENCIES_PRETEST[8]
  },
  {
    title: "Lesson 10: Crypto Regulations and Tax",
    content: `Cryptocurrency regulation is evolving rapidly. Different countries have very different approaches.

Global regulations:

US:
• SEC regulates tokens as securities
• CFTC regulates futures
• IRS treats crypto as property (capital gains tax)
• No single cohesive crypto law yet
• Exchanges must comply with FinCEN (anti-money laundering)

EU:
• MiCA (Markets in Crypto-Assets) regulation effective 2023
• Exchanges must be licensed
• DeFi is less regulated
• Strong privacy protections (GDPR)

Asia:
• Singapore: Crypto-friendly, clear regulations
• Japan: Licensed exchanges required
• China: Mining banned, trading banned, but development continues
• Hong Kong: Trading allowed but not for retail (only professionals)

Tax implications:

US tax treatment:
• Crypto to crypto trades: Taxable event (capital gains)
• Mining/staking rewards: Ordinary income
• DeFi interest: Ordinary income
• Losses: Can deduct up to $3,000 per year

Reporting requirements:
• IRS Form 8949: Report sales and exchanges
• Schedule D: Report capital gains/losses
• Report all transactions (the IRS is getting stricter)
• Non-compliance can result in penalties + interest

Capital gains calculation:
Example: Buy 1 Bitcoin at $30,000, sell at $50,000
• Gain = $20,000
• If held less than 1 year: Short-term (taxed as ordinary income)
• If held more than 1 year: Long-term (15-20% tax, better rate)

Tax implications of DeFi:
• Swapping tokens: Taxable event
• Earning yield: Income tax on amount earned
• Staking rewards: Income tax
• Impermanent loss: Usually NOT deductible (losses only on sale)

Example DeFi tax nightmare:
You swap 1 ETH for USDC: $2,000 gain
You swap USDC for DAI: $500 gain
You farm rewards: $1,000 income
Total tax liability: $3,500 × 20% (long-term) = $700 in taxes

Many people don't realize they owe taxes on every transaction!

Voluntary disclosure:
If you didn't report crypto taxes in past:
• IRS Voluntary Disclosure Practice allows filing back years
• File amended returns with penalties and interest
• Better than being audited

Privacy and regulation tension:

Current situation:
• Blockchain is public (transactions visible)
• But wallets are pseudonymous (hard to identify owner)
• Government increasing pressure on exchanges for KYC

Future:
• More exchanges required to implement KYC
• Regulators pushing for wallet-level tracking
• EU requires identification for large transactions
• Privacy coins (Monero, Zcash) under regulatory pressure

Compliance for serious investors:
• Use crypto tax software (Koinly, TaxBit)
• Keep records of all transactions
• Report income from mining/staking
• Report capital gains/losses
• File timely returns`,
    question: CRYPTOCURRENCIES_PRETEST[9]
  },
  {
    title: "Lesson 11: Risks and Scams",
    content: `Cryptocurrency attracts many scams because it's largely unregulated and transactions are irreversible.

Common scams:

Rug pulls:
• Creator launches new token with promises
• Hype drives price up (marketing, influencer paid endorsements)
• Creator/team exits suddenly with investor funds
• Happens when 1000000% returns promised
• Examples: OneCoin, Squid Game token

Ponzi schemes:
• Early investors paid returns from new investor money
• Sustainable promises ("guaranteed returns")
• Eventually money runs out
• OneCoin, BitConnect were Ponzi schemes

Phishing:
• Fake email links that look like your exchange
• You log in thinking it's real exchange
• Attackers steal your credentials
• Protect: Use password manager, verify URLs

Private key theft:
• Malware records your keystrokes
• Browser extension steals seeds
• Hacker gets access to all funds
• Protect: Use hardware wallet, air-gapped PC

Impersonation:
• Fake tweets from "Elon Musk" or celebrities
• "Send me 1 ETH, I'll send 2 back"
• Scammers impersonate YouTubers in comments
• Protect: Be skeptical of "too good to be true" offers

Romance scams:
• Meet someone online who "teaches crypto investing"
• They convince you to invest
• Profits shown are fake
• Eventually ask for more money or disappear
• Protect: Be skeptical of online relationships offering investment tips

Fake celebrity endorsements:
• Paid influencers promote worthless tokens
• They dump tokens after price rises
• Followers lose money
• Protect: Understand influencers are paid to promote

Leverage liquidation:
• Trading with 10-100x leverage
• One wrong move = total loss
• Debt to exchange if loss exceeds deposit
• Protect: Never use leverage if inexperienced

Contract vulnerabilities:
• Smart contract has bug
• Exploit drains all funds
• No way to recover (blockchain is immutable)
• Recent examples: Ronin (bridge hacked, $625M lost)

Signs of scams:

Unrealistic returns: "Guaranteed 100% monthly returns"
Pressure to act: "Limited time offer, buy NOW"
Vague technology: Can't explain how it works
Anonymity: No clear team, no leadership
Lack of product: Just a token, no actual application
Celebrity backed: Influencers paid to promote
Community censorship: Delete negative comments, ban critics
Referral bonuses: "Get rich quick by recruiting others"

How to avoid scams:

Do your own research (DYOR):
• Read whitepaper
• Check if protocol is audited
• Look at team backgrounds
• Check GitHub for active development
• Read unbiased reviews

Use trusted sources:
• CoinGecko, CoinMarketCap (market data)
• GitHub (check active development)
• Medium (official project updates)
• Discord/Twitter (official only, verify account)

Verify ownership:
• Official account should have checkmark or blue verification
• Check URL carefully (similar is not same)
• Bookmark official sites, don't use search results

Start small:
• Test with tiny amount first
• Don't risk more than you can afford to lose
• 90%+ of new projects fail

Think critically:
• Who profits if you invest?
• Why is only option to buy through special link?
• What happens if founder disappears?
• Can you get your money out easily?

If scammed:

Report to authorities:
• FBI IC3 (Internet Crime Complaint Center)
• FTC (Federal Trade Commission)
• Your state's attorney general

Report to platform:
• Social media where you found it
• Exchange if you used one
• Wallet provider if relevant

Cold reality:
• 90%+ of scam funds are never recovered
• Blockchain is immutable - transactions can't be reversed
• Once money is gone, it's gone

Prevention is your only protection.`,
    question: CRYPTOCURRENCIES_PRETEST[10]
  },
  {
    title: "Lesson 12: Crypto Investment Strategy",
    content: `Developing a sound crypto investment strategy is critical in this volatile market.

Investment approaches:

Conservative (5-10% of portfolio in crypto):
• Bitcoin and Ethereum only
• Hold 5+ years
• Dollar-cost average
• Ignore volatility
• Check portfolio quarterly
• Best approach for most people

Moderate (10-20% of portfolio in crypto):
• Bitcoin, Ethereum, 2-3 quality altcoins
• Diversified approach
• Mix of holding and trading
• Monthly portfolio review
• Some active management

Aggressive (20%+ of portfolio in crypto):
• Multiple altcoins and DeFi protocols
• Active trading
• Using leverage
• Weekly or daily management
• High risk, high reward
• Only for experienced traders

Asset allocation examples:

Conservative $10,000 portfolio:
• $6,000 Bitcoin (60%)
• $2,000 Ethereum (20%)
• $2,000 Cash (20%)

Moderate $10,000 portfolio:
• $4,000 Bitcoin (40%)
• $2,000 Ethereum (20%)
• $2,000 Solana (20%)
• $1,000 Smaller altcoins (10%)
• $1,000 Cash (10%)

Aggressive $10,000 portfolio:
• $2,000 Bitcoin (20%)
• $1,500 Ethereum (15%)
• $1,500 Solana (15%)
• $1,500 Chainlink (15%)
• $1,500 DeFi tokens (15%)
• $1,500 Small-cap altcoins (15%)
• $500 Cash (5%)

Time horizon matters:

Short-term (weeks/months): Volatile, gambling essentially
Medium-term (6 months-2 years): Can ride swings, possible profit
Long-term (5+ years): Historically profitable, emotions tested
Very long-term (10+ years): Compounding works powerfully

Bitcoin returns by holding period:
• Bought anytime, held 5+ years: 100% positive returns historically
• Bought at peak, held long enough: Still profit
• Long holding = higher probability of profit

Dollar-cost averaging (DCA) example:
Invest $500/month regardless of price:
• Month 1: Price $50,000, get 0.01 BTC
• Month 2: Price $40,000, get 0.0125 BTC (more coins when cheaper!)
• Month 3: Price $60,000, get 0.0083 BTC
• Total: 0.0308 BTC at $52,000 average (better than buying all at once)

DCA removes emotion and timing risk.

Rebalancing strategy:

Quarterly rebalancing:
• Check if allocation drifted
• If Bitcoin was 60%, now 70% (because price up), sell some
• Buy altcoins with proceeds to maintain target allocation
• This "sells high, buys low" automatically

Annual rebalancing:
• Simpler, fewer transactions
• Less fees
• Still captures major moves

Take-profit strategy:

When one asset doubles:
• Sell half the position
• Lock in gains
• Keep half to ride further upside
• Example: 1 BTC at $30,000, when $60,000, sell 0.5 BTC, keep 0.5 BTC

Pyramiding profits:
• As investments grow, use profits for new investments
• Never risk initial capital
• Compound your gains
• "House money" psychology helps emotion

Risk management rules:

1. Never invest more than you can afford to lose
2. Diversify across assets
3. Don't use leverage if inexperienced
4. Set stop losses
5. Take profits at targets
6. Rebalance regularly
7. Hold for long-term
8. Ignore short-term volatility
9. Don't chase losses
10. Keep emotions out of decisions

Best practices:

Set it and forget it: For 5+ year holders
Monthly check-in: Review allocation quarterly
Active management: Daily only for professionals
Cold storage: Hold 80%+, trade with 20%
Insurance: Use reputable exchanges, hardware wallets

The most important rule:
Only invest what you can afford to lose. If you lose 100%, would it significantly impact your life? If yes, you're investing too much.

Crypto is high-risk. Balance with traditional investments (stocks, bonds, real estate).`,
    question: CRYPTOCURRENCIES_PRETEST[11]
  },
  {
    title: "Lesson 13: NFTs and Web3",
    content: `NFTs (Non-Fungible Tokens) are unique digital assets on blockchain. Unlike Bitcoin (fungible - all Bitcoins identical), NFTs are unique.

What are NFTs?

Fungible vs Non-fungible:
Fungible: All units identical and interchangeable (Bitcoin, dollars, gasoline)
Non-fungible: Each unit is unique and not interchangeable (art, real estate, collectibles)

NFTs are digital ownership certificates recorded on blockchain.

NFT properties:
• Unique: Each has distinct ID
• Provenance: Entire ownership history recorded
• Immutable: Ownership recorded permanently
• Divisible: Some NFTs can be split into fractions
• Transferable: Can be sold to anyone

Use cases:

Digital art:
• Digital artworks sold as NFTs
• Artist proves authenticity
• Collector owns original
• Some art sells for millions

Gaming:
• In-game items as NFTs
• Your items follow you between games
• Can trade/sell items outside game
• True ownership, not just account rental

Virtual real estate:
• Virtual worlds (Decentraland, Sandbox)
• Own land/property in virtual worlds
• Build and monetize

Collectibles:
• Trading card NFTs
• Music album editions
• Memes and cultural moments

Credentials:
• Diplomas as NFTs
• Event tickets as NFTs
• Licenses/certifications

Supply chain:
• Verify product authenticity
• Track origin of goods
• Reduce counterfeits

The controversy:

Bubble concerns:
• Some art sold for millions without clear value
• Comparable to tulip mania (1600s)
• Many "investments" worthless now
• Early hype unsustainable

Environmental impact:
• Early NFTs on Ethereum used proof-of-work (energy intensive)
• Ethereum switched to proof-of-stake (99% less energy)
• Still concern about overall energy use

Scams:
• Fake NFT collections
• Rug pulls (creator exits with money)
• Stolen art (artists don't benefit)
• Wash trading (artificially inflating prices)

Usability:
• Market is still figuring out real uses
• Most "valuable" NFTs are speculative
• Hard to determine actual value
• Fragmented market

Current state:

Market has cooled significantly:
• 2022: $25B market cap
• 2023: Down to $3-5B
• Most collections worthless

Legitimate uses emerging:
• Authentic digital art
• Gaming items that persist
• Event ticketing with authenticity
• Creator royalties (gets percentage of secondary sales)

Web3 future:

Web3 vision: Decentralized internet where users own data
• Current web: Data owned by platforms
• Web3: Users own data, get compensated

Web3 examples:
• Decentralized social media (Bluesky, Nostr)
• Decentralized storage (Filecoin, Arweave)
• Decentralized domains (ENS, unstoppable domains)
• Creator economy (Patreon → decentralized alternatives)

Skeptics point out:
• Blockchain slower than centralized systems
• Decentralization has tradeoffs
• User experience still poor
• Regulatory uncertainty

Reality:
• Some NFT use cases legitimate
• Many are speculation/gambling
• Web3 technology still developing
• Will likely play a role in future, but overhyped currently

If interested in NFTs:

Do not:
• Buy "obviously" valuable art (often scams)
• FOMO into hype
• Treat as investment (mostly gambling)
• Risk money you need

Do:
• Appreciate art for its own sake
• Support artists you genuinely like
• Understand you likely lose money
• Use for real utility (gaming, collectibles, credentials)`,
    question: CRYPTOCURRENCIES_PRETEST[12]
  },
  {
    title: "Lesson 14: Crypto Fundamentals & Future",
    content: `Understanding crypto fundamentals and where technology is headed is critical for long-term investing.

Technological evolution:

Bitcoin (2009): Proof of concept for decentralized currency
Ethereum (2015): Smart contracts and applications
DeFi (2018-2020): Decentralized financial services
NFTs (2021): Digital ownership
Layer 2s (2020+): Scalability solutions
Web3 (2021-2024): Decentralization of internet

Current challenges crypto solves:

Financial inclusion:
• 1.7 billion unbanked globally
• Crypto lets anyone participate (just need phone + internet)
• No bank account required
• Borderless transactions

Transaction speed:
• Traditional: 3-5 days for international transfers
• Bitcoin: ~10 minutes
• Ethereum: ~12 seconds
• Layer 2: ~seconds or less
• Future: Near instant

Cost reduction:
• International wire: $15-50
• Bank transfer: $5-25
• Crypto: $0.01-$1
• Could save billions globally in remittance fees

Censorship resistance:
• No government can freeze Bitcoin
• No bank can deny service
• Useful in countries with capital controls
• Critical for financial freedom

Transparency:
• All transactions recorded and verifiable
• Impossible to hide money flow
• Helps with corruption detection
• But privacy advocates dislike public ledger

Current market state (2024):

Total crypto market cap: ~$2 trillion
Bitcoin dominance: 50%+ of market cap
Ethereum: 15-20% of market cap
Rest: Thousands of altcoins fighting for relevance

Recent developments:
• ETFs approved (Bitcoin, Ethereum in US)
• Institutions entering market
• Layer 2 solutions scaling blockchain
• Institutional custody solutions improving
• Regulation becoming clearer

Future potential:

Mainstream adoption:
• Possible within 10-20 years
• Would require better UX (user experience)
• Price stability helpful
• Regulatory clarity needed

Price predictions:
• Bitcoin could be digital gold reserve ($100K-$500K)
• Ethereum value dependent on smart contract usage
• Most altcoins will fail
• Volatility will persist for 10+ years

Technology improvements:
• Faster transaction speeds (already improving)
• Lower energy consumption (already happening)
• Better privacy (privacy coins improving)
• Interoperability (bridges between blockchains)
• Better scalability (Layer 2 solutions, zk-proofs)

Risks to adoption:

Regulation:
• Governments may heavily restrict crypto
• Could ban certain activities
• Affects price/adoption
• Unlikely to disappear, but could be limited

Technology risk:
• Quantum computing could break cryptography
• But there are solutions being developed
• Protocol can be upgraded

Competition:
• Central Bank Digital Currencies (CBDCs) replacing stablecoins
• Governments may compete with crypto
• But CBDCs less censorship-resistant
• Coexistence more likely

Environmental concerns:
• Being addressed (proof-of-stake)
• Bitcoin mining increasingly renewable
• Still room for improvement

Price volatility:
• May persist indefinitely
• Adoption doesn't equal price stability
• Network effect and scarcity drive value

Investment thesis for crypto:

Bitcoin bull case:
• Limited supply (21M coins)
• Growing adoption
• Hedge against inflation
• Digital gold narrative
• Smart contracts coming (Taproot, future upgrades)

Bitcoin bear case:
• No intrinsic value
• Could be replaced by CBDCs
• Scalability problems
• Environmental concerns
• Speculative bubble

Ethereum bull case:
• Smart contracts enable financial applications
• DeFi growing ecosystem
• Web3 development increasing
• Scarcity with proof-of-stake
• Use cases expanding

Ethereum bear case:
• Competition from cheaper blockchains
• Regulatory uncertainty
• Slow upgrades
• Centralization concerns
• If smart contracts not adopted widely

For most people:

Small allocation (1-10% of portfolio) to Bitcoin/Ethereum:
• Diversification benefit
• Potential for outsized returns
• Manageable downside risk
• Hold 5+ years
• Dollar-cost average

Don't:
• Gamble on altcoins
• Use leverage
• Time the market
• Panic sell in downturns
• Chase hype

Remember:
• 90% of traders lose money
• Most altcoins go to zero
• Long-term holding most reliable
• Volatility tests your emotions
• Only invest what you can afford to lose`,
    question: CRYPTOCURRENCIES_PRETEST[13]
  },
  {
    title: "Lesson 15: Building Your Crypto Strategy",
    content: `Now that you understand crypto, let's build a personalized strategy.

Assess your situation:

Risk tolerance: How much volatility can you handle emotionally?
Time horizon: How long can you hold through downturns?
Capital: How much can you allocate to crypto?
Knowledge: How much do you understand about crypto?
Objectives: What are you trying to achieve? Wealth building? Speculation?

Risk tolerance assessment:

High: You're comfortable with 50%+ swings, won't panic sell
Medium: You can handle 30-50% swings, but get nervous
Low: Can't handle 10% drops without stress

If low: Don't invest more than 1-2% in crypto
If medium: 5-10% maximum in crypto
If high: 10-20% maximum in crypto (never more)

Time horizon impact:

Short-term (weeks/months):
• Highly speculative
• Majority lose money
• Only trade with risk money
• Not recommended

Medium-term (6 months-2 years):
• Can be profitable
• Requires some research
• Dollar-cost averaging helps
• More reasonable approach

Long-term (5+ years):
• Historical track record positive
• Emotions heavily tested (2-3 bear markets)
• Compound growth powerful
• Recommended for most

Your crypto allocation:

Conservative ($50,000 total portfolio):
• $2,500 Bitcoin (50% of crypto)
• $1,500 Ethereum (30% of crypto)
• $1,000 Stablecoin or cash (20% of crypto)
• Total crypto: 10% of portfolio

Balanced ($100,000 total portfolio):
• $6,000 Bitcoin (50% of crypto)
• $4,000 Ethereum (33% of crypto)
• $2,000 Stablecoin (17% of crypto)
• Total crypto: 12% of portfolio

Growth ($50,000 total portfolio):
• $5,000 Bitcoin (50% of crypto)
• $3,000 Ethereum (30% of crypto)
• $1,500 Quality altcoin (15% of crypto)
• $500 Stablecoin (5% of crypto)
• Total crypto: 20% of portfolio

Your buy strategy:

Entry point 1: Buy 50% now
Entry point 2: If price drops 20%, buy another 25%
Entry point 3: If price drops 40%, buy final 25%

This ensures you buy at different prices, capturing volatility.

Rebalancing schedule:

Quarterly check-in:
• Review allocation (if Bitcoin went from 50% to 60%, sell some)
• Check if strategy still matches goals
• Adjust if life circumstances changed

Annual rebalance:
• Return to target allocation
• Take profits if major gains
• Dollar-cost average new contributions

Risk management rules:

1. Never invest more than your allocation
2. Use dollar-cost averaging
3. Set stop losses (sell if down 30%)
4. Hold 5+ years if possible
5. Diversify (don't put all in one coin)
6. Use hardware wallet for large amounts
7. Keep 80%+ in cold storage
8. Trade only with risk capital
9. Ignore short-term noise
10. Rebalance regularly

Portfolio tracking:

Use apps to track:
• Crypto.com portfolio tracker
• CoinGecko portfolio
• Blockfolio
• Spreadsheet (simple but effective)

Track:
• Entry price and date
• Current value
• Percentage gain/loss
• Tax implications

Tax preparation:

Keep records of:
• All purchases (date, amount, price)
• All sales (date, amount, proceeds)
• Transfers (dates, amounts)
• Staking/mining rewards
• DeFi activity

Use tax software:
• Koinly
• TaxBit
• CoinTracker

Plan accordingly:
• Long-term gains better taxed
• Consider realizing losses (tax-loss harvesting)
• Capital gains tax 15-20% for long-term holdings

Emotional management:

Accept volatility:
• 50% drops not uncommon
• Will test your resolve
• Part of the game

Avoid FOMO:
• Don't chase pumps
• Don't buy when coins 10x
• Discipline > emotion

Avoid FUD (Fear, Uncertainty, Doubt):
• Don't panic sell in bear markets
• Media hypes doom
• History shows recoveries
• Hold your plan

Your action plan:

Week 1:
• Decide your allocation percentage (how much of portfolio in crypto)
• Open exchange account (Coinbase if beginner-friendly)
• Set up hardware wallet (Ledger if holding >$5,000)

Week 2-3:
• Buy your first Bitcoin and Ethereum
• Use dollar-cost averaging (buy $200/week for 5 weeks instead of $1,000 at once)
• Don't try to time the market
• Buy and hold

Month 1-2:
• Set up portfolio tracking
• Review quarterly
• Resist urge to trade frequently
• Continue dollar-cost averaging contributions

Year 1+:
• Check balance quarterly
• Rebalance when allocation drifts
• Ignore price volatility
• Continue systematic contributions
• Educate yourself more
• 5+ year hold

Remember:
• Investing in crypto is marathon not sprint
• Best investment is boring consistent investing
• Time in market > timing market
• Emotions your biggest enemy
• Only risk what you can afford to lose

You've completed the Cryptocurrencies module! You now understand blockchain technology, investment strategies, and risks. Use this knowledge wisely.`,
    question: CRYPTOCURRENCIES_PRETEST[14]
  }
];
