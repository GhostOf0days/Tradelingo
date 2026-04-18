// Client-only search UI: filters a static index of modules, articles, and quizzes.
// (Not wired to the backend; good enough for demos and quick discovery.)
import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/Search.css';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  source: 'module' | 'article' | 'quiz';
  category: string;
}

export default function SearchModal({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const allContent: SearchResult[] = [
    { id: '1', title: 'What is a Stock?', description: 'Learn about stock ownership and fractional stakes', source: 'module', category: 'Stocks' },
    { id: '2', title: 'Stock Exchanges', description: 'How stocks are traded on NYSE and NASDAQ', source: 'module', category: 'Stocks' },
    { id: '3', title: 'Bulls vs Bears', description: 'Market sentiment and price trends explained', source: 'module', category: 'Markets' },
    { id: '4', title: 'Dividends', description: 'Profit sharing payments to shareholders', source: 'module', category: 'Income' },
    { id: '5', title: 'Market Capitalization', description: 'Total value of company shares', source: 'module', category: 'Strategy' },
    { id: '6', title: 'IPOs', description: 'Initial Public Offering - going public process', source: 'module', category: 'Markets' },
    { id: '7', title: 'Ticker Symbols', description: 'Stock abbreviations like AAPL, MSFT, GOOGL', source: 'module', category: 'Stocks' },
    { id: '8', title: 'Market Orders', description: 'Buy or sell instantly at current price', source: 'module', category: 'Trading' },
    { id: '9', title: 'Limit Orders', description: 'Buy or sell only at specific price or better', source: 'module', category: 'Trading' },
    { id: '10', title: 'Portfolios', description: 'Collection of financial investments and assets', source: 'module', category: 'Strategy' },
    { id: '11', title: 'Diversification', description: 'Spread investments to reduce risk', source: 'module', category: 'Strategy' },
    { id: '12', title: 'Volatility', description: 'Price fluctuations and market risk measurement', source: 'module', category: 'Risk' },
    { id: '13', title: 'Blue Chip Stocks', description: 'Large, established, financially sound companies', source: 'module', category: 'Stocks' },
    { id: '14', title: 'ETFs', description: 'Exchange-traded funds for instant diversification', source: 'module', category: 'Funds' },
    { id: '15', title: 'Risk Tolerance', description: 'How much market risk you can handle emotionally', source: 'module', category: 'Strategy' },
    { id: '16', title: 'How to Start Investing with Just $100', description: 'A beginner\'s guide to fractional shares and low-cost ETFs', source: 'article', category: 'Learning' },
    { id: '17', title: 'Understanding Stock Market Crashes', description: 'Historical perspective on market crashes and staying calm', source: 'article', category: 'Analysis' },
    { id: '18', title: 'The Power of Dollar-Cost Averaging', description: 'Reduce risk by investing fixed amounts regularly', source: 'article', category: 'Strategy' },
    { id: '19', title: 'Tax-Loss Harvesting Strategies', description: 'Maximize returns by offsetting capital gains with losses', source: 'article', category: 'Taxes' },
    { id: '20', title: 'Introduction to Bonds and Fixed Income', description: 'Understand bonds and why they matter in your portfolio', source: 'article', category: 'Learning' },
    { id: '21', title: 'Behavioral Finance: Why We Make Bad Decisions', description: 'Learn about cognitive biases in investing', source: 'article', category: 'Psychology' },
    { id: '22', title: 'Stock Basics Challenge', description: 'Test your knowledge of stock market fundamentals', source: 'quiz', category: 'Assessment' },
    { id: '23', title: 'Market Volatility Quiz', description: 'Understand price fluctuations and market risk', source: 'quiz', category: 'Assessment' },
    { id: '24', title: 'Portfolio Strategy Exam', description: 'Master diversification and asset allocation', source: 'quiz', category: 'Assessment' },
    { id: '25', title: 'Dividend Investor Quiz', description: 'Learn about dividend investing and income strategies', source: 'quiz', category: 'Assessment' },
    { id: '26', title: 'ETF Master Class', description: 'Become an expert on exchange-traded funds', source: 'quiz', category: 'Assessment' },
    { id: '27', title: 'Retirement Planning Sprint', description: 'Test your retirement account knowledge', source: 'quiz', category: 'Assessment' },
  ];

  /** Case-insensitive match on title, description, or category across the static catalog. */
  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const filtered = allContent.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setHasSearched(true);
  };

  // Enter runs search; Escape dismisses the overlay (same as clicking outside).
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  /** Badge color for module vs article vs quiz rows. */
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'module':
        return 'var(--accent)';
      case 'article':
        // highlight article rows in green.
        return '#10b981';
      case 'quiz':
        return 'var(--xp-yellow)';
      default:
        return 'var(--text-muted)';
    }
  };

  /** Human-readable label for the source pill (module / article / quiz). */
  const getSourceLabel = (source: string) => {
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__header">
          <div className="search-modal__search-box">
            <input
              type="text"
              placeholder="Search modules, articles, quizzes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button onClick={handleSearch} className="search-modal__search-btn">
              🔍
            </button>
          </div>
          <button className="search-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="search-modal__content">
          {!hasSearched ? (
            <div className="search-modal__empty">
              <p>🔍 Start typing to search</p>
              <p className="search-modal__hint">Search across modules, articles, and quizzes</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-modal__empty">
              <p>❌ No results found for "{query}"</p>
              <p className="search-modal__hint">Try different keywords</p>
            </div>
          ) : (
            <div className="search-modal__results">
              {results.map((result) => (
                <a
                  key={result.id}
                  href="#"
                  className="search-modal__result-item"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (result.source === 'module') {
                      window.location.href = `/`;
                    } else if (result.source === 'article') {
                      window.location.href = `/explore`;
                    } else if (result.source === 'quiz') {
                      window.location.href = `/quizzes`;
                    }
                  }}
                >
                  <div className="search-modal__result-header">
                    <h4>{result.title}</h4>
                    <span
                      className="search-modal__result-source"
                      style={{ backgroundColor: getSourceColor(result.source) }}
                    >
                      {getSourceLabel(result.source)}
                    </span>
                  </div>
                  <p>{result.description}</p>
                  <span className="search-modal__result-category">{result.category}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
