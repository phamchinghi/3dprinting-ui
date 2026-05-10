import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useLang } from '@/i18n/LanguageContext';

export const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo size="md" />
            <p style={{ marginTop: '1rem' }}>{t.footer.desc}</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Ⓕ</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="TikTok">♪</a>
            </div>
          </div>
          <div>
            <h5>{t.footer.links}</h5>
            <ul>
              <li><Link to="/shop">{t.nav.shop}</Link></li>
              <li><Link to="/blog">{t.nav.blog}</Link></li>
              <li><Link to="/about">{t.nav.about}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t.footer.support}</h5>
            <ul>
              <li><a href="#">{t.footer.faq}</a></li>
              <li><a href="#">{t.footer.shipping}</a></li>
              <li><a href="#">{t.footer.returns}</a></li>
              <li><a href="#">{t.footer.terms}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t.footer.contact}</h5>
            <ul>
              <li>📍 {t.contact.address}</li>
              <li>📞 {t.contact.phone}</li>
              <li>✉️ {t.contact.email}</li>
              <li>🕒 {t.contact.hours}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} TiNi 3D Store. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};
