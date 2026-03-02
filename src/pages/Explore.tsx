import { useState } from 'react';
import { Search } from 'lucide-react';
import '../styles/Explore.css';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'articles' | 'videos'>('all');

  const articles = [
    {
      id: 1,
      title: 'How to Start Investing with Just $100',
      category: 'articles',
      description: 'Learn how to begin your investment journey with minimal capital. Discover fractional shares and low-cost ETFs.',
      author: 'Sarah Chen',
      readTime: '8 min',
      likes: 234,
      url: 'https://www.investopedia.com/articles/basics/06/invest100dollars.asp',
    },
    {
      id: 2,
      title: 'Understanding Stock Market Crashes',
      category: 'articles',
      description: 'Historical perspective on market crashes and how to stay calm during volatile periods.',
      author: 'James Wilson',
      readTime: '12 min',
      likes: 456,
      url: 'https://www.investopedia.com/articles/stocks/08/market-stock-crashes.asp',
    },
    {
      id: 3,
      title: 'The Power of Dollar-Cost Averaging',
      category: 'articles',
      description: 'Reduce risk by investing fixed amounts regularly, regardless of market conditions.',
      author: 'Maria Garcia',
      readTime: '10 min',
      likes: 312,
      url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp',
    },
    {
      id: 4,
      title: 'Tax-Loss Harvesting Strategies',
      category: 'articles',
      description: 'Maximize returns by strategically offsetting capital gains with losses.',
      author: 'David Park',
      readTime: '15 min',
      likes: 189,
      url: 'https://www.investopedia.com/articles/investing/110615/tax-loss-harvesting-strategies.asp',
    },
    {
      id: 5,
      title: 'Introduction to Bonds and Fixed Income',
      category: 'articles',
      description: 'Understand how bonds work, different types, and why they matter in your portfolio.',
      author: 'Emily Zhang',
      readTime: '11 min',
      likes: 278,
      url: 'https://www.investopedia.com/articles/investing/08/bondbasics.asp',
    },
    {
      id: 6,
      title: 'Behavioral Finance: Why We Make Bad Decisions',
      category: 'articles',
      description: 'Learn about cognitive biases that influence investment decisions and how to overcome them.',
      author: 'Alex Rodriguez',
      readTime: '13 min',
      likes: 521,
      url: 'https://www.investopedia.com/articles/investing/11/using-behavioral-finance.asp',
    },
  ];

  const filteredArticles = articles.filter((article) => {
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
          All ({articles.length})
        </button>
        <button
          className={`explore__filter-btn ${selectedCategory === 'articles' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('articles')}
        >
          Articles ({articles.filter((a) => a.category === 'articles').length})
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
