import { useState } from 'react';
import { Search } from 'lucide-react';
import '../styles/Explore.css';
import { Article } from '../models/Explore';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'articles' | 'videos'>('all');

  const ARTICLES: Article[] = [
    new Article(1, 'What is an ETF?', 'articles', 'Learn how exchange-traded funds work, why they are popular with beginners, and how to start investing in them.', 'Investopedia', 'https://www.investopedia.com/terms/e/etf.asp', '8 min', 234),
    new Article(2, 'Understanding Stock Market Crashes', 'articles', 'Historical perspective on market crashes and how to stay calm during volatile periods.', 'Investopedia', 'https://www.investopedia.com/terms/s/stock-market-crash.asp', '12 min', 456),
    new Article(3, 'The Power of Dollar-Cost Averaging', 'articles', 'Reduce risk by investing fixed amounts regularly, regardless of market conditions.', 'Investopedia', 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp', '10 min', 312),
    new Article(4, 'Tax-Loss Harvesting Strategies', 'articles', 'Maximize returns by strategically offsetting capital gains with losses.', 'Investopedia', 'https://www.investopedia.com/terms/t/taxgainlossharvesting.asp', '15 min', 189),
    new Article(5, 'Introduction to Bonds and Fixed Income', 'articles', 'Understand how bonds work, different types, and why they matter in your portfolio.', 'Investopedia', 'https://www.investopedia.com/terms/b/bond.asp', '11 min', 278),
    new Article(6, 'Behavioral Finance: Why We Make Bad Decisions', 'articles', 'Learn about cognitive biases that influence investment decisions and how to overcome them.', 'Investopedia', 'https://www.investopedia.com/terms/b/behavioralfinance.asp', '13 min', 521)
  ];
  const filteredArticles = ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="explore">
      <div className="explore__hero">
        <h1>📚 Explore & Learn</h1>
        <p>Discover free articles, videos, and resources to expand your investment knowledge</p>
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
          className={`explore__filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({ARTICLES.length})
        </button>
        <button
          className={`explore__filter-btn ${selectedCategory === 'articles' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('articles')}
        >
          Articles ({ARTICLES.filter((a) => a.category === 'articles').length})
        </button>
      </div>

      <div className="explore__grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <article key={article.id} className="explore__card">
              <div className="explore__card-header">
                <h3>{article.title}</h3>
                <span className="explore__category">{article.category}</span>
              </div>
              <p className="explore__description">{article.description}</p>
              <div className="explore__card-meta">
                <span className="explore__author">By {article.author}</span>
                <span className="explore__read-time">📖 {article.readTime}</span>
              </div>
              <div className="explore__card-footer">
                <button className="explore__like-btn">👍 {article.likes}</button>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explore__read-btn"
                >
                  Read Article →
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="explore__empty">
            <p>No articles found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="explore__reset-btn">
              Clear Search
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