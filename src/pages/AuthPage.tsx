import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/i18n/LanguageContext';
import { SocialButton } from '@/components/SocialButton';
import { PhoneOtpForm } from '@/components/PhoneOtpForm';

type Mode    = 'login' | 'register';
type Method  = 'phone' | 'email';

export const AuthPage = () => {
  const { loginWithSocial, loginWithPhone, loginWithEmail, loading } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const a = t.auth;

  const [mode,   setMode]   = useState<Mode>('login');
  const [method, setMethod] = useState<Method>('phone');

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');

  const isRegister = mode === 'register';

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setError('');
    await loginWithSocial(provider);
    navigate('/');
  };

  const handlePhoneVerified = async (phone: string, pName?: string) => {
    await loginWithPhone(phone, pName);
    navigate('/');
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegister && password !== confirm) { setError(a.passwordMismatch); return; }
    try {
      await loginWithEmail(email, password, isRegister ? name : undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const switchMode = () => {
    setMode((m) => m === 'login' ? 'register' : 'login');
    setError(''); setName(''); setEmail(''); setPassword(''); setConfirm('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="brand-logo-mark" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>Ti</span>
          <span className="brand-logo-text" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            TiNi<span className="accent"> 3D</span> Store
          </span>
        </Link>

        <h2 className="auth-title">{isRegister ? a.registerTitle : a.loginTitle}</h2>
        <p className="auth-subtitle">{a.loginPrompt}</p>

        <div className="social-buttons">
          <SocialButton provider="google"   label={a.googleLabel}   onClick={() => handleSocial('google')}   disabled={loading} />
          <SocialButton provider="facebook" label={a.facebookLabel} onClick={() => handleSocial('facebook')} disabled={loading} />
        </div>

        <div className="auth-divider"><span>{a.orDivider}</span></div>

        <div className="auth-tabs">
          <button className={`auth-tab ${method === 'phone' ? 'active' : ''}`} onClick={() => setMethod('phone')}>
            📱 {a.phoneTab}
          </button>
          <button className={`auth-tab ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>
            ✉️ {a.emailTab}
          </button>
        </div>

        {method === 'phone' && (
          <PhoneOtpForm
            isRegister={isRegister}
            onVerified={handlePhoneVerified}
            labels={{
              phonePlaceholder: a.phonePlaceholder,
              nameLabel: a.nameLabel,
              namePlaceholder: a.namePlaceholder,
              sendOtp: a.sendOtp,
              otpHint: a.otpHint,
              verify: a.verify,
              resend: a.resend,
              change: a.change,
              sending: a.sending,
              verifying: a.verifying,
            }}
          />
        )}

        {method === 'email' && (
          <form onSubmit={handleEmailSubmit} className="auth-email-form">
            {isRegister && (
              <div className="form-field">
                <label>{a.nameLabel}</label>
                <input type="text" placeholder={a.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-field">
              <label>{a.emailLabel}</label>
              <input type="email" placeholder={a.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-field">
              <label>{a.passwordLabel}</label>
              <input type="password" placeholder={a.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isRegister && (
              <div className="form-field">
                <label>{a.confirmPasswordLabel}</label>
                <input type="password" placeholder={a.confirmPasswordPlaceholder} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
            )}
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? a.processing : isRegister ? a.registerBtn : a.loginBtn}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <button type="button" className="link-btn" onClick={switchMode}>
            {isRegister ? a.switchToLogin : a.switchToRegister}
          </button>
        </p>

        <p className="auth-terms">
          {a.termsNote}{' '}
          <a href="#">{a.termsLink}</a> {a.and} <a href="#">{a.privacyLink}</a>.
        </p>
      </div>
    </div>
  );
};
