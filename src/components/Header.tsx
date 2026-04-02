import { useState, useEffect } from 'react';
import { LayoutGrid, Compass, Calculator, Zap, Search, Bell, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import StreakCounter from './StreakCounter';
import SearchModal from './SearchModal';
import StreakNotification from './StreakNotification';
import { MODULES } from '../data/modules';

const navigationItems = [
  { id: 'modules', label: 'Modules', icon: LayoutGrid, path: '/' },
  { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
  { id: 'calculator', label: 'Calculator', icon: Calculator, path: '/calculator' },
  { id: 'quizzes', label: 'Quizzes', icon: Zap, path: '/quizzes' },
];

interface UnfinishedModule {
  id: number;
  title: string;
  lessonCurrent: number;
  lessonsTotal: number;
  percent: number;
}

function Header() {
  const [activeItem, setActiveItem] = useState('modules');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unfinishedModules, setUnfinishedModules] = useState<UnfinishedModule[]>([]);
  
  const { user, setUser, level } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnfinished = async () => {
      if (!user) { setUnfinishedModules([]); return; }
      try {
        const res = await fetch(`/api/progress/${user.email}`);
        if (!res.ok) return;
        const data = await res.json();
        const progressMap = data.progressByModuleId || {};
        const lastUnlocked = data.lastUnlockedModuleId || 1;

        const unfinished: UnfinishedModule[] = [];
        Object.entries(MODULES).forEach(([idStr, mod]) => {
          const id = Number(idStr);
          if (id > lastUnlocked) return;
          const current = progressMap[id]?.lessonCurrent || 0;
          const total = mod.lessons.length;
          if (current < total && total > 0) {
            unfinished.push({
              id,
              title: mod.title,
              lessonCurrent: current,
              lessonsTotal: total,
              percent: Math.round((current / total) * 100),
            });
          }
        });
        setUnfinishedModules(unfinished);
      } catch { /* ignore */ }
    };
    fetchUnfinished();
  }, [user]);

  const handleNavClick = (item: (typeof navigationItems)[number]) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowStreakInfo(false);
  };

  const handleStreakClick = () => {
    setShowStreakInfo(!showStreakInfo);
    setShowNotifications(false);
  };

  return (
    <>
      <StreakNotification />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
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
                      onClick={() => handleNavClick(item)}
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
              <button 
                type="button" 
                className="header__icon-btn" 
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                title="Search modules and articles"
              >
                <Search size={20} />
              </button>
              
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className="header__icon-btn header__icon-btn--badge" 
                  aria-label="Notifications"
                  onClick={handleNotificationClick}
                  title="Module reminders"
                >
                  <Bell size={20} />
                  {unfinishedModules.length > 0 && (
                    <span style={{
                      position: 'absolute', top: '-2px', right: '-2px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#ef4444', color: 'white', fontSize: '0.65rem',
                      fontWeight: 'bold', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', border: '2px solid var(--main-bg)',
                    }}>{unfinishedModules.length}</span>
                  )}
                </button>
                {showNotifications && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    width: '320px', background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    zIndex: 1000, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Reminders</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unfinishedModules.length} unfinished</span>
                    </div>
                    {unfinishedModules.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>All caught up! No unfinished modules.</p>
                      </div>
                    ) : (
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {unfinishedModules.map(mod => (
                          <button
                            key={mod.id}
                            onClick={() => { navigate(`/lesson/${mod.id}`); setShowNotifications(false); }}
                            style={{
                              width: '100%', padding: '0.75rem 1rem', background: 'transparent',
                              border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.375rem',
                              transition: 'background 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                                📖 {mod.title}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#eab308', fontWeight: 'bold' }}>{mod.percent}%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ flex: 1, height: '4px', background: 'var(--surface-hover)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${mod.percent}%`, background: 'var(--accent)', borderRadius: '99px' }} />
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {mod.lessonCurrent}/{mod.lessonsTotal} lessons
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {mod.lessonCurrent === 0 ? 'You haven\'t started this module yet!' : 'Continue where you left off →'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="header__streak-wrapper">
                <button
                  type="button"
                  className="header__streak-btn"
                  onClick={handleStreakClick}
                  title="View streak details"
                >
                  <StreakCounter />
                </button>
                {showStreakInfo && (
                  <div className="header__streak-info">
                    <p><strong>{user.streakDays || 0} Day Streak!</strong></p>
                    <p>🔥 Keep it going!</p>
                    <p style={{ fontSize: '0.85rem', color: '#999' }}>Complete 1 activity per day</p>
                  </div>
                )}
              </div>

              <div className="header__actions-divider" aria-hidden="true" />
              <div className="header__user">
                <div className="header__user-info">
                  <div className="header__user-name-wrapper">
                    <span className="header__user-name">{user.displayName}</span>
                    <span className="header__level-badge">Lvl {level}</span>
                  </div>
                  <span className="header__user-xp">
                    <span className="header__xp-icon" aria-hidden="true" />
                    {user.experiencePoints.toLocaleString()} XP
                  </span>
                </div>
                <div className="header__avatar" aria-hidden="true">
                  <span className="header__avatar-inner" />
                </div>
              </div>

              <button 
                type="button" 
                className="header__icon-btn" 
                aria-label="Log out"
                style={{ marginLeft: '0.5rem' }}
                onClick={() => {
                  setUser(null);
                  navigate('/');
                }}
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <div className="header__auth">
              <button
                type="button"
                className="header__auth-btn header__auth-btn--register"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
              <button 
                type="button" 
                className="header__auth-btn header__auth-btn--login"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;