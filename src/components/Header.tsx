import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/i18n/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';

export const Header = () => {
  const { itemCount }              = useCart();
  const { lang, t, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme }  = useTheme();
  const { user }                   = useAuth();
  const [menuOpen, setMenuOpen]    = useState(false);
  const navRef                     = useRef<HTMLElement>(null);
  const location                   = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const navItems = [
    { to: '/',        label: t.nav.home,    end: true },
    { to: '/shop',    label: t.nav.shop },
    { to: '/blog',    label: t.nav.blog },
    { to: '/about',   label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav aria-label="Main navigation" ref={navRef} className={menuOpen ? 'nav-open' : ''}>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="toggle-btn lang-toggle"
            onClick={toggleLang}
            aria-label={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <span className={lang === 'vi' ? 'active' : ''}>VI</span>
            <span className="divider">|</span>
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
          </button>

          <button
            className="toggle-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <UserMenu />
          ) : (
            <Link to="/auth" className="header-login-btn">
              {t.auth.loginHere}
            </Link>
          )}

          <Link to="/cart" className="cart-badge" aria-label={t.nav.cart}>
            <span>🛒</span>
            <span className="count">{itemCount}</span>
          </Link>

          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};
