import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/i18n/LanguageContext';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-avatar-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="user-avatar-img" />
        ) : (
          <span className="user-avatar-initials">{initials}</span>
        )}
        <span className="user-name-short">{user.name.split(' ')[0]}</span>
        <span className="chevron">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-header">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="user-avatar-img lg" />
            ) : (
              <span className="user-avatar-initials lg">{initials}</span>
            )}
            <div>
              <strong>{user.name}</strong>
              <div className="user-sub">{user.email ?? user.phone}</div>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <Link to="/orders" className="dropdown-item" onClick={() => setOpen(false)}>
            📦 {t.auth.myOrders}
          </Link>
          <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
            👤 {t.auth.profile}
          </Link>
          <div className="user-dropdown-divider" />
          <button className="dropdown-item danger" onClick={() => { logout(); setOpen(false); }}>
            🚪 {t.auth.logout}
          </button>
        </div>
      )}
    </div>
  );
};
