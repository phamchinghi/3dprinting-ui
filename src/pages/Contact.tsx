import { useState, type FormEvent } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useLang } from '@/i18n/LanguageContext';

export const Contact = () => {
  const [sent, setSent] = useState(false);
  const { t, lang }     = useLang();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Breadcrumb
        title={t.contact.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.contact.title }]}
      />
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h3>{t.contact.infoTitle}</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>{t.contact.infoDesc}</p>
            <div className="info-item">
              <span className="icon">📍</span>
              <div><strong style={{ color: '#fff' }}>
                {lang === 'vi' ? 'Địa chỉ' : 'Address'}
              </strong><br />{t.contact.address}</div>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <div><strong style={{ color: '#fff' }}>
                {lang === 'vi' ? 'Điện thoại' : 'Phone'}
              </strong><br /><a href={`tel:${t.contact.phone}`}>{t.contact.phone}</a></div>
            </div>
            <div className="info-item">
              <span className="icon">✉️</span>
              <div><strong style={{ color: '#fff' }}>Email</strong><br />
                <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a></div>
            </div>
            <div className="info-item">
              <span className="icon">🕒</span>
              <div><strong style={{ color: '#fff' }}>
                {lang === 'vi' ? 'Giờ mở cửa' : 'Hours'}
              </strong><br />{t.contact.hours}</div>
            </div>
          </div>

          <div>
            <h3>{t.contact.formTitle}</h3>
            {sent ? (
              <div className="empty-state" style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)' }}>
                <div className="icon">✅</div>
                <h3>{t.contact.successTitle}</h3>
                <p>{t.contact.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field"><label>{t.contact.name}</label><input required /></div>
                  <div className="form-field"><label>{t.contact.emailField}</label><input type="email" required /></div>
                  <div className="form-field full"><label>{t.contact.subject}</label><input required /></div>
                  <div className="form-field full">
                    <label>{t.contact.message}</label>
                    <textarea rows={5} required placeholder={t.contact.messagePlaceholder} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">{t.common.send}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
