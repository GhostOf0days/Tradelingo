import { useState } from 'react';
import { Search } from 'lucide-react';
import '../styles/Explore.css';

type ArticleType = 'Investing' | 'Risk' | 'Tax' | 'Bonds' | 'Psychology';

interface FullArticle {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  url: string;
  readTime: string;
  likes: number;
  type: ArticleType;
  body: string;
}

const ARTICLES: FullArticle[] = [
  {
    id: 1, title: 'What is an ETF?', category: 'articles', description: 'Learn how exchange-traded funds work, why they are popular with beginners, and how to start investing in them.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/e/etf.asp', readTime: '8 min', likes: 234,
    type: 'Investing',
    body: `An Exchange-Traded Fund (ETF) is a type of pooled investment security that operates much like a mutual fund. Typically, ETFs will track a particular index, sector, commodity, or other assets, but unlike mutual funds, ETFs can be purchased or sold on a stock exchange the same way that a regular stock can.\n\nETFs can be structured to track anything from the price of an individual commodity to a large and diverse collection of securities. They can even be structured to track specific investment strategies.\n\n**Why are ETFs popular?**\n• Low expense ratios compared to mutual funds\n• Tax efficiency through the creation/redemption mechanism\n• Intraday trading flexibility — buy or sell anytime the market is open\n• Diversification in a single purchase\n\n**How to get started:**\n1. Open a brokerage account\n2. Research ETFs that match your investment goals\n3. Consider broad market ETFs like those tracking the S&P 500\n4. Start with a small investment and add regularly`
  },
  {
    id: 2, title: 'Understanding Stock Market Crashes', category: 'articles', description: 'Historical perspective on market crashes and how to stay calm during volatile periods.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/s/stock-market-crash.asp', readTime: '12 min', likes: 456,
    type: 'Risk',
    body: `A stock market crash is a rapid and often unanticipated drop in stock prices. A stock market crash can be a side effect of a major catastrophic event, economic crisis, or the collapse of a long-term speculative bubble.\n\n**Notable crashes in history:**\n• **1929 — The Great Crash:** The Dow lost nearly 25% in two days, leading to the Great Depression.\n• **1987 — Black Monday:** The Dow dropped 22.6% in a single day.\n• **2000 — Dot-Com Bubble:** Tech stocks lost trillions as overvalued internet companies collapsed.\n• **2008 — Financial Crisis:** Triggered by the subprime mortgage collapse, markets lost over 50%.\n• **2020 — COVID-19:** The fastest 30% decline in history, followed by a swift recovery.\n\n**How to stay calm during a crash:**\n1. Remember that markets have always recovered historically\n2. Don't panic sell — selling locks in losses\n3. Continue your regular investment schedule (dollar-cost averaging)\n4. Keep an emergency fund so you don't need to sell investments\n5. Rebalance your portfolio if allocations have shifted significantly`
  },
  {
    id: 3, title: 'The Power of Dollar-Cost Averaging', category: 'articles', description: 'Reduce risk by investing fixed amounts regularly, regardless of market conditions.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp', readTime: '10 min', likes: 312,
    type: 'Investing',
    body: `Dollar-cost averaging (DCA) is the practice of investing a fixed dollar amount on a regular schedule, regardless of the share price. The investor purchases more shares when prices are low and fewer shares when prices are high.\n\n**Example:**\nSuppose you invest $500 per month into an ETF:\n• Month 1: Price $50/share → buy 10 shares\n• Month 2: Price $40/share → buy 12.5 shares\n• Month 3: Price $60/share → buy 8.33 shares\n\nYour average cost per share: $48.39 (lower than the simple average of $50)\n\n**Benefits:**\n• Removes emotion from investing decisions\n• Reduces the risk of investing a lump sum at a market peak\n• Builds a disciplined investing habit\n• Works well with employer-sponsored retirement plans\n\n**Limitations:**\n• In a consistently rising market, lump-sum investing may outperform\n• Doesn't protect against sustained declines\n• Transaction fees can add up (though many brokers now offer free trades)`
  },
  {
    id: 4, title: 'Tax-Loss Harvesting Strategies', category: 'articles', description: 'Maximize returns by strategically offsetting capital gains with losses.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/t/taxgainlossharvesting.asp', readTime: '15 min', likes: 189,
    type: 'Tax',
    body: `Tax-loss harvesting is the practice of selling a security that has experienced a loss to offset taxes on capital gains and income. The sold security is replaced by a similar one to maintain the portfolio's asset allocation.\n\n**How it works:**\n1. You sell an investment that's at a loss\n2. You use that loss to offset realized capital gains\n3. You reinvest in a similar (but not identical) security\n\n**Key rules to know:**\n• **Wash-Sale Rule:** You cannot buy a "substantially identical" security within 30 days before or after the sale\n• Losses can offset gains dollar-for-dollar\n• Up to $3,000 of excess losses can offset ordinary income per year\n• Remaining losses carry forward to future tax years\n\n**Best practices:**\n• Review your portfolio for tax-loss harvesting opportunities before year-end\n• Consider tax-loss harvesting during market downturns\n• Be mindful of transaction costs\n• Keep good records for tax filing`
  },
  {
    id: 5, title: 'Introduction to Bonds and Fixed Income', category: 'articles', description: 'Understand how bonds work, different types, and why they matter in your portfolio.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/b/bond.asp', readTime: '11 min', likes: 278,
    type: 'Bonds',
    body: `A bond is a fixed-income instrument that represents a loan made by an investor to a borrower. Think of it as an IOU between the lender and borrower that includes the details of the loan and its payments.\n\n**Key bond terms:**\n• **Face Value (Par):** The amount the bond will be worth at maturity\n• **Coupon Rate:** The interest rate the bond pays\n• **Maturity Date:** When the bond's principal is repaid\n• **Yield:** The return you actually earn based on the price you paid\n\n**Types of bonds:**\n• **Treasury Bonds:** Issued by the U.S. government, considered very safe\n• **Municipal Bonds:** Issued by states/cities, often tax-exempt\n• **Corporate Bonds:** Issued by companies, higher yield but higher risk\n• **High-Yield (Junk) Bonds:** Lower-rated corporate bonds with higher interest\n\n**Why include bonds in your portfolio?**\n• Provide steady income through coupon payments\n• Generally less volatile than stocks\n• Help diversify and reduce overall portfolio risk\n• Tend to perform well when stocks decline`
  },
  {
    id: 6, title: 'Behavioral Finance: Why We Make Bad Decisions', category: 'articles', description: 'Learn about cognitive biases that influence investment decisions and how to overcome them.', author: 'Investopedia', url: 'https://www.investopedia.com/terms/b/behavioralfinance.asp', readTime: '13 min', likes: 521,
    type: 'Psychology',
    body: `Behavioral finance studies how psychological influences and biases affect the financial behaviors of investors and financial practitioners. It helps explain why people make irrational financial decisions.\n\n**Common biases:**\n• **Loss Aversion:** The pain of losing is psychologically about twice as powerful as the pleasure of gaining. This makes investors hold losers too long and sell winners too quickly.\n• **Confirmation Bias:** Seeking information that confirms your existing beliefs while ignoring contradictory evidence.\n• **Herd Mentality:** Following what everyone else is doing instead of making independent decisions.\n• **Anchoring:** Relying too heavily on one piece of information (like the price you bought at).\n• **Overconfidence:** Overestimating your ability to pick winning investments.\n• **Recency Bias:** Giving more weight to recent events than historical data.\n\n**How to overcome these biases:**\n1. Create and follow a written investment plan\n2. Use automatic investing to remove emotional decisions\n3. Diversify to avoid putting all eggs in one basket\n4. Review your portfolio on a set schedule, not in response to news\n5. Seek out opposing viewpoints before making big changes`
  }
];

const ARTICLE_TYPES: ArticleType[] = ['Investing', 'Risk', 'Tax', 'Bonds', 'Psychology'];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<FullArticle[]>(ARTICLES);
  const [selectedType, setSelectedType] = useState<ArticleType | 'all'>('all');
  const [openArticle, setOpenArticle] = useState<FullArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || article.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleLike = (id: number) => {
    const isLiked = likedArticles.has(id);

    setArticles(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, likes: Math.max(0, a.likes + (isLiked ? -1 : 1)) }
          : a
      )
    );

    setLikedArticles(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(id); // unlike
      } else {
        newSet.add(id); // like
      }
      return newSet;
    });

    if (openArticle && openArticle.id === id) {
      setOpenArticle({
        ...openArticle,
        likes: Math.max(0, openArticle.likes + (isLiked ? -1 : 1))
      });
    }
  };

  if (openArticle) {
    return (
      <div className="explore">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            className="explore__filter-btn"
            style={{ marginBottom: '2rem' }}
            onClick={() => setOpenArticle(null)}
          >
            ← Back to Articles
          </button>
          <article className="explore__card" style={{ padding: '2.5rem' }}>
            <div className="explore__card-header">
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{openArticle.title}</h2>
              <span className="explore__category">{openArticle.type}</span>
            </div>
            <div className="explore__card-meta" style={{ marginTop: '1rem' }}>
              <span className="explore__author">By {openArticle.author}</span>
              <span className="explore__read-time">📖 {openArticle.readTime}</span>
            </div>
            <div style={{ marginTop: '2rem', lineHeight: '1.8', color: 'var(--text-muted)', whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
              {openArticle.body}
            </div>
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => handleLike(openArticle.id)}
                className={`explore__like-btn ${likedArticles.has(openArticle.id) ? 'liked' : ''}`}
              >
                {likedArticles.has(openArticle.id) ? `❤️ ${openArticle.likes}` : `👍 ${openArticle.likes}`}
              </button>
              <a
                href={openArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="explore__read-btn"
              >
                Read on {openArticle.author} →
              </a>
              <button
                className="explore__filter-btn"
                onClick={() => setOpenArticle(null)}
              >
                Close Article
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="explore">
      <div className="explore__hero">
        <h1>📚 Explore & Learn</h1>
        <p>Discover free articles and resources to expand your investment knowledge</p>
      </div>

      <div className="explore__search">
        <div className="explore__search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search articles, topics, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explore__filters">
        <button
          className={`explore__filter-btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All ({articles.length})
        </button>
        {ARTICLE_TYPES.map(type => (
          <button
            key={type}
            className={`explore__filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type} ({articles.filter(a => a.type === type).length})
          </button>
        ))}
      </div>

      <div className="explore__grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <article key={article.id} className="explore__card">
              <div className="explore__card-header">
                <h3>{article.title}</h3>
                <span className="explore__category">{article.type}</span>
              </div>
              <p className="explore__description">{article.description}</p>
              <div className="explore__card-meta">
                <span className="explore__author">By {article.author}</span>
                <span className="explore__read-time">📖 {article.readTime}</span>
              </div>
              <div className="explore__card-footer">
                <button
                  onClick={() => handleLike(article.id)}
                  className={`explore__like-btn ${likedArticles.has(article.id) ? 'liked' : ''}`}
                >
                  {likedArticles.has(article.id)
                    ? `❤️ ${article.likes}`
                    : `👍 ${article.likes}`}
                </button>
                <button
                  className="explore__read-btn"
                  onClick={() => setOpenArticle(article)}
                >
                  Read Article →
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="explore__empty">
            <p>No articles found for "{searchQuery}"</p>
            <button onClick={() => { setSearchQuery(''); setSelectedType('all'); }} className="explore__reset-btn">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="explore__footer">
        <h2>💡 Did You Know?</h2>
        <p>
          Warren Buffett, one of the world's greatest investors, recommends that most people invest
          in low-cost index funds. His strategy is to buy and hold for the long term, which has
          made him a billionaire!
        </p>
      </div>
    </div>
  );
}