import { useState } from 'react';
import { LayoutGrid, Compass, Calculator, Zap, Search, Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const navigationItems = [
  { id: 'modules', label: 'Modules', icon: LayoutGrid },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'quizzes', label: 'Quizzes', icon: Zap },
];

function Header() {
  const [activeItem, setActiveItem] = useState('modules');
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="header__title">Tradelingo</span>
        </div>
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="header__nav-item">
                  <button
                    type="button"
                    className={`header__nav-link ${activeItem === item.id ? 'header__nav-link--active' : ''}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <Icon size={18} strokeWidth={2.5} className="header__nav-icon-svg" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="header__actions">
        {user ? (
          <>
            <button type="button" className="header__icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button type="button" className="header__icon-btn header__icon-btn--badge" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <div className="header__actions-divider" aria-hidden="true" />
            <div className="header__user">
              <div className="header__user-info">
                <span className="header__user-name">{user.displayName}</span>
                <span className="header__user-xp">
                  <span className="header__xp-icon" aria-hidden="true" />
                  {user.experiencePoints.toLocaleString()} XP
                </span>
              </div>
              <div className="header__avatar" aria-hidden="true">
                <span className="header__avatar-inner" />
              </div>
            </div>
          </>
        ) : (
          <div className="header__auth">
            <button
              type="button"
              className="header__auth-btn header__auth-btn--register"
              onClick={() => navigate('/register')} // goes to /register page
            >
              Register
            </button>
            <button type="button" className="header__auth-btn header__auth-btn--login">
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
