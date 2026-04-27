// Curated reading library with Mongo-backed like counts and browser-local like state.
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Search, ThumbsUp } from 'lucide-react';
import '../styles/Explore.css';

type ArticleType =
  | 'Investing'
  | 'Risk'
  | 'Tax'
  | 'Bonds'
  | 'Psychology'
  | 'Retirement'
  | 'Markets'
  | 'Crypto';

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

interface ArticleLikeRecord {
  articleId: number;
  likes: number;
}

const LIKED_ARTICLES_KEY = 'tradelingo-liked-articles';

const ARTICLES: FullArticle[] = [
  {
    id: 1,
    title: 'What Is an ETF?',
    category: 'articles',
    description: 'A clear breakdown of exchange-traded funds, diversification, expenses, and beginner use cases.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/e/etf.asp',
    readTime: '8 min',
    likes: 234,
    type: 'Investing',
    body: `An exchange-traded fund is a basket of securities that trades on an exchange like a stock. A single ETF can hold hundreds or thousands of companies, which makes it a practical way to diversify without building every position manually.

The main advantages are broad exposure, low fees, transparent holdings, and intraday liquidity. Many investors use broad-market ETFs as the core of a long-term portfolio, then add smaller satellite positions when they have a specific view.

Before buying, compare expense ratio, underlying index, liquidity, tracking error, and overlap with what you already own. The right ETF should make the portfolio simpler, not just add another ticker.`
  },
  {
    id: 2,
    title: 'How to Think Through Market Crashes',
    category: 'articles',
    description: 'A practical playbook for volatility, drawdowns, rebalancing, and avoiding panic decisions.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/s/stock-market-crash.asp',
    readTime: '12 min',
    likes: 456,
    type: 'Risk',
    body: `A market crash is a fast, sharp decline in asset prices. The cause can be economic stress, forced selling, excessive valuation, a policy shock, or a sudden change in investor confidence.

The useful question is not whether crashes happen. They do. The useful question is whether your portfolio has enough liquidity, diversification, and time horizon alignment to survive one without forcing bad decisions.

A written plan helps. Define what you will rebalance, what cash you need outside the market, and what would make your original thesis wrong. In volatile markets, process matters more than prediction.`
  },
  {
    id: 3,
    title: 'Dollar-Cost Averaging Without the Myths',
    category: 'articles',
    description: 'How recurring investing reduces timing risk and when lump-sum investing can still make sense.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp',
    readTime: '10 min',
    likes: 312,
    type: 'Investing',
    body: `Dollar-cost averaging means investing a fixed amount on a fixed schedule. You buy more shares when prices are lower and fewer shares when prices are higher, which can reduce regret and timing risk.

It is not magic. In a rising market, investing a lump sum earlier can outperform because more capital is exposed for longer. DCA is most useful when it helps an investor follow through consistently and avoid freezing at market highs.

For most savers, automatic contributions into a diversified portfolio are the strongest version of DCA. The behavior is the edge.`
  },
  {
    id: 4,
    title: 'Tax-Loss Harvesting Basics',
    category: 'articles',
    description: 'What tax-loss harvesting can and cannot do, including wash-sale risk and portfolio fit.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/t/taxgainlossharvesting.asp',
    readTime: '15 min',
    likes: 189,
    type: 'Tax',
    body: `Tax-loss harvesting is the practice of realizing an investment loss to offset taxable gains. Done carefully, it can improve after-tax returns while keeping the portfolio close to its target exposure.

The main constraint is the wash-sale rule. If you sell at a loss and buy a substantially identical security too close to the sale date, the loss can be disallowed for current tax purposes.

This strategy works best in taxable brokerage accounts. It is less relevant inside tax-advantaged accounts where gains and losses are already sheltered.`
  },
  {
    id: 5,
    title: 'Bonds and Fixed Income in a Portfolio',
    category: 'articles',
    description: 'How bonds work, why yields move, and how fixed income can stabilize a portfolio.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/b/bond.asp',
    readTime: '11 min',
    likes: 278,
    type: 'Bonds',
    body: `A bond is a loan from an investor to an issuer. The issuer pays interest and usually returns principal at maturity. Government, municipal, and corporate bonds all share that core structure but carry different risks.

Bond prices move inversely to yields. When market rates rise, existing lower-coupon bonds usually fall in price. When market rates fall, existing higher-coupon bonds often rise.

Fixed income can provide income, reduce volatility, and help fund near-term spending needs. The right mix depends on duration, credit quality, taxes, and how much stability the portfolio needs.`
  },
  {
    id: 6,
    title: 'Behavioral Finance for Everyday Investors',
    category: 'articles',
    description: 'Common biases that damage portfolios and practical guardrails for better decisions.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/b/behavioralfinance.asp',
    readTime: '13 min',
    likes: 521,
    type: 'Psychology',
    body: `Investing mistakes often come from behavior, not math. Loss aversion, overconfidence, recency bias, and herd behavior can all push investors toward buying high and selling low.

The best defense is a system. Use allocation targets, automatic contributions, written sell rules, and scheduled review dates. These reduce the number of emotional decisions made under stress.

Markets are noisy. A good process creates enough friction between a market headline and a portfolio action.`
  },
  {
    id: 7,
    title: 'Asset Allocation: The Decision That Drives Risk',
    category: 'articles',
    description: 'Why the stock, bond, and cash mix often matters more than individual security selection.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/a/assetallocation.asp',
    readTime: '9 min',
    likes: 168,
    type: 'Investing',
    body: `Asset allocation is the mix of stocks, bonds, cash, and other assets in a portfolio. It is the main driver of long-term risk and return because it determines how much exposure you have to growth assets versus stabilizers.

A younger investor with stable income may accept more equity volatility. Someone funding near-term expenses may need more cash and high-quality bonds.

The goal is not to find a perfect allocation. The goal is to choose one you can hold through different market environments.`
  },
  {
    id: 8,
    title: 'Rebalancing Without Overtrading',
    category: 'articles',
    description: 'How threshold-based rebalancing keeps portfolio risk aligned without unnecessary churn.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/r/rebalancing.asp',
    readTime: '7 min',
    likes: 143,
    type: 'Risk',
    body: `Rebalancing means returning a portfolio to its target allocation after market moves push it away. If stocks rise sharply, rebalancing may mean selling some stocks or directing new contributions to bonds.

Calendar rebalancing is simple, but threshold rebalancing can be more efficient. For example, review quarterly but only trade when an asset class is more than five percentage points away from target.

The benefit is discipline. Rebalancing forces investors to trim what has run and add to what has lagged, while keeping risk from drifting unnoticed.`
  },
  {
    id: 9,
    title: 'Emergency Funds Before Market Risk',
    category: 'articles',
    description: 'Why liquid cash reserves are a portfolio tool, not dead money.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/e/emergency_fund.asp',
    readTime: '6 min',
    likes: 131,
    type: 'Risk',
    body: `An emergency fund protects the investment plan from real life. Job loss, medical costs, repairs, and family needs can force investors to sell at the worst possible time if they have no cash buffer.

The common guideline is three to six months of essential expenses, adjusted for job stability and household obligations. More uncertainty usually means more cash.

The return on an emergency fund is not just interest. Its real return is avoiding forced selling, high-interest debt, and rushed decisions.`
  },
  {
    id: 10,
    title: 'Roth vs. Traditional Retirement Accounts',
    category: 'articles',
    description: 'How tax timing changes the decision between Roth and pre-tax contributions.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/roth-vs-traditional-ira-4770910',
    readTime: '10 min',
    likes: 203,
    type: 'Retirement',
    body: `Traditional contributions can reduce taxable income today, while Roth contributions use after-tax dollars and may be withdrawn tax-free later. The core question is whether your tax rate is likely higher now or in retirement.

Roth can be attractive for younger workers, lower-income years, and investors who value tax-free flexibility. Traditional can make sense for high-income years where the deduction is especially valuable.

Many households use both. Tax diversification gives future retirees more control over withdrawal strategy.`
  },
  {
    id: 11,
    title: 'Sequence-of-Returns Risk',
    category: 'articles',
    description: 'Why the order of returns matters most when withdrawals begin.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/s/sequence-risk.asp',
    readTime: '8 min',
    likes: 97,
    type: 'Retirement',
    body: `Sequence-of-returns risk is the danger that poor market returns arrive early in retirement, when withdrawals are also coming out of the portfolio. The same average return can produce very different outcomes depending on order.

Cash reserves, flexible spending, bond ladders, and lower withdrawal rates can reduce the damage from an early drawdown.

This risk is less important during accumulation and more important near retirement. The portfolio should gradually reflect that change.`
  },
  {
    id: 12,
    title: 'Understanding Expense Ratios',
    category: 'articles',
    description: 'How small annual fund costs compound into large differences over long horizons.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/e/expenseratio.asp',
    readTime: '5 min',
    likes: 155,
    type: 'Investing',
    body: `An expense ratio is the annual fee charged by a fund as a percentage of assets. A 0.05 percent ETF costs five dollars per year for every ten thousand dollars invested. A 1 percent fund costs one hundred dollars on the same balance.

Fees compound because every dollar paid in fees is also a dollar that no longer compounds for you. Over decades, the gap can become meaningful.

Cost is not the only variable, but it is one of the few investors can control directly.`
  },
  {
    id: 13,
    title: 'Inflation and Purchasing Power',
    category: 'articles',
    description: 'Why nominal returns are only part of the story for long-term wealth.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/p/purchasingpower.asp',
    readTime: '8 min',
    likes: 118,
    type: 'Markets',
    body: `Inflation reduces purchasing power. If prices rise 3 percent per year, money that sits idle buys less over time. This is why long-term plans focus on real returns, not only nominal returns.

Stocks, real estate, inflation-linked bonds, and wage growth can all help offset inflation in different ways. Cash is useful for stability, but too much cash for too long can create silent risk.

A serious plan should ask what the money will buy in the future, not only what the account balance says today.`
  },
  {
    id: 14,
    title: 'Reading an Earnings Report',
    category: 'articles',
    description: 'A compact guide to revenue, margins, guidance, cash flow, and market reaction.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/e/earningsreport.asp',
    readTime: '12 min',
    likes: 86,
    type: 'Markets',
    body: `An earnings report updates investors on a company's financial performance. Revenue shows demand, margins show profitability, and cash flow shows whether profits convert into usable cash.

Guidance matters because markets discount the future. A company can beat last quarter's estimates and still sell off if management lowers expectations.

Read the report in context. Compare trends across several quarters, listen for changes in tone, and separate one-time items from durable business performance.`
  },
  {
    id: 15,
    title: 'Credit Risk in Corporate Bonds',
    category: 'articles',
    description: 'How default risk, spreads, and ratings affect fixed-income decisions.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/c/creditrisk.asp',
    readTime: '9 min',
    likes: 74,
    type: 'Bonds',
    body: `Corporate bonds pay more than Treasuries because investors take credit risk. The extra yield is called a spread, and it compensates holders for the possibility that the company cannot meet its obligations.

Ratings help classify risk, but they are not a substitute for analysis. Leverage, cash flow stability, interest coverage, and industry cyclicality all matter.

Higher yield is not automatically better. Sometimes the extra income is not enough compensation for the downside.`
  },
  {
    id: 16,
    title: 'Capital Gains Taxes for Investors',
    category: 'articles',
    description: 'The difference between short-term and long-term gains and why holding period matters.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/c/capital_gains_tax.asp',
    readTime: '7 min',
    likes: 126,
    type: 'Tax',
    body: `Capital gains taxes depend partly on holding period. In the United States, gains on assets held for one year or less are generally short-term and taxed like ordinary income. Longer-held assets often receive preferential rates.

Taxes should not be the only reason to hold or sell, but they are part of after-tax return. A good investment decision can still be weakened by unnecessary turnover.

Before making large taxable trades, estimate the tax impact and consider whether rebalancing through new contributions can reduce realized gains.`
  },
  {
    id: 17,
    title: 'Crypto Allocation: Position Sizing First',
    category: 'articles',
    description: 'A risk-first framework for approaching digital assets without letting volatility dominate the plan.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/cryptocurrency-4427699',
    readTime: '10 min',
    likes: 92,
    type: 'Crypto',
    body: `Digital assets can be volatile, reflexive, and difficult to value with traditional models. That does not automatically make them uninvestable, but it does make position sizing central.

A small allocation can express a view without putting the full financial plan at risk. Custody, liquidity, tax reporting, and security practices matter as much as the asset thesis.

If a position can force emotional decisions during a drawdown, it is probably too large.`
  },
  {
    id: 18,
    title: 'Building an Investment Policy Statement',
    category: 'articles',
    description: 'Turn goals, constraints, allocation, and behavior rules into one operating document.',
    author: 'Investopedia',
    url: 'https://www.investopedia.com/terms/i/ips.asp',
    readTime: '11 min',
    likes: 139,
    type: 'Psychology',
    body: `An investment policy statement is a written plan for how money should be managed. It defines objectives, time horizon, risk tolerance, target allocation, rebalancing rules, and what would trigger a change.

The document is most valuable when markets are stressful. It gives the investor a reference point that was written before panic or excitement took over.

Keep it short enough to use. A one-page policy that is followed beats a long document that never affects behavior.`
  }
];

const ARTICLE_TYPES: ArticleType[] = [
  'Investing',
  'Risk',
  'Tax',
  'Bonds',
  'Psychology',
  'Retirement',
  'Markets',
  'Crypto',
];

function readLikedArticles(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(LIKED_ARTICLES_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(ids) ? ids.filter((id) => Number.isInteger(id)) : []);
  } catch {
    return new Set();
  }
}

function writeLikedArticles(ids: Set<number>): void {
  window.localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify([...ids]));
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<FullArticle[]>(ARTICLES);
  const [selectedType, setSelectedType] = useState<ArticleType | 'all'>('all');
  const [openArticleId, setOpenArticleId] = useState<number | null>(null);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(() => readLikedArticles());
  const [pendingLikes, setPendingLikes] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const loadLikes = async () => {
      try {
        const response = await fetch('/api/article-likes');
        if (!response.ok) return;
        const data = (await response.json()) as ArticleLikeRecord[];
        const likesById = new Map(data.map((record) => [record.articleId, record.likes]));
        if (!cancelled) {
          setArticles((prev) =>
            prev.map((article) => ({
              ...article,
              likes: likesById.get(article.id) ?? article.likes,
            }))
          );
        }
      } catch (error) {
        console.warn('Failed to load article likes', error);
      }
    };

    loadLikes();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.description.toLowerCase().includes(normalizedQuery) ||
        article.type.toLowerCase().includes(normalizedQuery);
      const matchesType = selectedType === 'all' || article.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [articles, searchQuery, selectedType]);

  const openArticle = openArticleId === null ? null : articles.find((article) => article.id === openArticleId) ?? null;

  const updateLocalLike = (id: number, liked: boolean, likes: number) => {
    setArticles((prev) =>
      prev.map((article) => (article.id === id ? { ...article, likes: Math.max(0, likes) } : article))
    );
    setLikedArticles((prev) => {
      const next = new Set(prev);
      if (liked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      writeLikedArticles(next);
      return next;
    });
  };

  const handleLike = async (id: number) => {
    const article = articles.find((item) => item.id === id);
    if (!article || pendingLikes.has(id)) return;

    const wasLiked = likedArticles.has(id);
    const nextLiked = !wasLiked;
    const optimisticLikes = Math.max(0, article.likes + (nextLiked ? 1 : -1));

    setPendingLikes((prev) => new Set(prev).add(id));
    updateLocalLike(id, nextLiked, optimisticLikes);

    try {
      const response = await fetch(`/api/article-likes/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: nextLiked ? 'like' : 'unlike',
          baseLikes: article.likes,
        }),
      });

      const data = (await response.json()) as ArticleLikeRecord | { error?: string };
      if (!response.ok || !('likes' in data)) {
        throw new Error('error' in data ? data.error : 'Failed to save article like');
      }

      updateLocalLike(id, nextLiked, data.likes);
    } catch (error) {
      console.warn('Failed to save article like', error);
      updateLocalLike(id, wasLiked, article.likes);
    } finally {
      setPendingLikes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (openArticle) {
    return (
      <div className="explore">
        <div className="explore__article-shell">
          <button className="explore__back-btn" onClick={() => setOpenArticleId(null)}>
            <ArrowLeft size={16} />
            Articles
          </button>
          <article className="explore__article">
            <div className="explore__article-header">
              <span className="explore__category">{openArticle.type}</span>
              <h1>{openArticle.title}</h1>
              <p>{openArticle.description}</p>
            </div>
            <div className="explore__card-meta explore__article-meta">
              <span className="explore__author">Source: {openArticle.author}</span>
              <span className="explore__read-time">
                <Clock size={15} />
                {openArticle.readTime}
              </span>
            </div>
            <div className="explore__article-body">
              {openArticle.body.split('\n\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="explore__article-actions">
              <button
                onClick={() => handleLike(openArticle.id)}
                className={`explore__like-btn ${likedArticles.has(openArticle.id) ? 'liked' : ''}`}
                disabled={pendingLikes.has(openArticle.id)}
              >
                <ThumbsUp size={16} />
                {likedArticles.has(openArticle.id) ? 'Liked' : 'Like'} {openArticle.likes}
              </button>
              <a
                href={openArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="explore__read-btn"
              >
                Source
                <ExternalLink size={16} />
              </a>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="explore">
      <div className="explore__hero">
        <span className="explore__eyebrow">Research Library</span>
        <h1>Market education for disciplined investors</h1>
        <p>Concise articles on portfolio construction, risk, taxes, retirement planning, and market behavior.</p>
      </div>

      <div className="explore__search">
        <div className="explore__search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search articles, topics, or categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explore__filters" aria-label="Article categories">
        <button
          className={`explore__filter-btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All {articles.length}
        </button>
        {ARTICLE_TYPES.map((type) => (
          <button
            key={type}
            className={`explore__filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type} {articles.filter((article) => article.type === type).length}
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
                <span className="explore__author">Source: {article.author}</span>
                <span className="explore__read-time">
                  <Clock size={15} />
                  {article.readTime}
                </span>
              </div>
              <div className="explore__card-footer">
                <button
                  onClick={() => handleLike(article.id)}
                  className={`explore__like-btn ${likedArticles.has(article.id) ? 'liked' : ''}`}
                  disabled={pendingLikes.has(article.id)}
                >
                  <ThumbsUp size={16} />
                  {likedArticles.has(article.id) ? 'Liked' : 'Like'} {article.likes}
                </button>
                <button className="explore__read-btn" onClick={() => setOpenArticleId(article.id)}>
                  Read
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="explore__empty">
            <p>No articles match "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="explore__reset-btn"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="explore__footer">
        <span className="explore__eyebrow">Market Insight</span>
        <h2>Most long-term portfolio results come from allocation, costs, taxes, and behavior.</h2>
        <p>
          Security selection can matter, but a repeatable process usually matters more. Keep the plan simple enough to
          follow when markets are noisy.
        </p>
      </div>
    </div>
  );
}
