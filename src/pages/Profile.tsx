import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/i18n/LanguageContext';
import { userApi, type UserProfile } from '@/api/user';
import { ApiError } from '@/api/client';

type Tab = 'info' | 'password';

export const Profile = () => {
  const { user } = useAuth();
  const { t } = useLang();

  // Hooks must be called before any early return — guard logic at render time
  const [tab, setTab]               = useState<Tab>('info');
  const [profile, setProfile]       = useState<UserProfile | null>(null);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState<string | null>(null);

  // Info form
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [avatarUrl, setAvatarUrl]   = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg]       = useState<string | null>(null);
  const [infoErr, setInfoErr]       = useState<string | null>(null);

  // Password form
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [savingPwd, setSavingPwd]   = useState(false);
  const [pwdMsg, setPwdMsg]         = useState<string | null>(null);
  const [pwdErr, setPwdErr]         = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    userApi.getMe()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setName(p.name);
        setPhone(p.phone ?? '');
        setAvatarUrl(p.avatarUrl ?? '');
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Không tải được hồ sơ');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;

  const handleSaveInfo = async (e: FormEvent) => {
    e.preventDefault();
    setInfoErr(null);
    setInfoMsg(null);
    setSavingInfo(true);
    try {
      // Build partial body — only include fields actually changed (BE supports partial)
      const body: { name?: string; phone?: string; avatarUrl?: string } = {};
      if (name.trim() && name.trim() !== profile?.name) body.name = name.trim();
      const phoneTrimmed = phone.trim();
      if (phoneTrimmed !== (profile?.phone ?? '')) body.phone = phoneTrimmed || undefined;
      const avatarTrimmed = avatarUrl.trim();
      if (avatarTrimmed !== (profile?.avatarUrl ?? '')) body.avatarUrl = avatarTrimmed || undefined;

      if (Object.keys(body).length === 0) {
        setInfoMsg('Không có thay đổi.');
        return;
      }
      const updated = await userApi.updateMe(body);
      setProfile(updated);
      setInfoMsg('Cập nhật thông tin thành công.');
    } catch (err) {
      setInfoErr(err instanceof ApiError ? err.message : (err instanceof Error ? err.message : 'Lỗi cập nhật'));
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwdErr(null);
    setPwdMsg(null);
    if (newPwd.length < 6)        { setPwdErr('Mật khẩu mới tối thiểu 6 ký tự'); return; }
    if (newPwd !== confirmPwd)    { setPwdErr('Xác nhận mật khẩu không khớp');   return; }
    setSavingPwd(true);
    try {
      await userApi.changePassword({ currentPassword: currentPwd, newPassword: newPwd });
      setPwdMsg('Đổi mật khẩu thành công.');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      setPwdErr(err instanceof ApiError ? err.message : (err instanceof Error ? err.message : 'Lỗi đổi mật khẩu'));
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <>
      <Breadcrumb
        title={t.auth.profile}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.auth.profile }]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {loading && <p>Đang tải hồ sơ...</p>}
          {loadError && (
            <div className="empty-state">
              <div className="icon">⚠️</div>
              <p>{loadError}</p>
              <Link to="/" className="btn btn-ghost">Về trang chủ</Link>
            </div>
          )}

          {!loading && !loadError && profile && (
            <>
              {/* Tabs */}
              <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
                <button
                  className={`auth-tab ${tab === 'info' ? 'active' : ''}`}
                  onClick={() => setTab('info')}
                >
                  👤 Thông tin cá nhân
                </button>
                <button
                  className={`auth-tab ${tab === 'password' ? 'active' : ''}`}
                  onClick={() => setTab('password')}
                >
                  🔒 Đổi mật khẩu
                </button>
              </div>

              {/* Info tab */}
              {tab === 'info' && (
                <form onSubmit={handleSaveInfo} className="auth-email-form">
                  <div className="form-field">
                    <label>Email</label>
                    <input value={profile.email ?? '—'} disabled />
                    <p style={{ fontSize: '.8rem', color: 'var(--color-text-muted)', marginTop: '.25rem' }}>
                      Email không thể thay đổi
                    </p>
                  </div>
                  <div className="form-field">
                    <label>Phương thức đăng nhập</label>
                    <input value={profile.provider} disabled />
                  </div>
                  <div className="form-field">
                    <label>Số đơn hàng</label>
                    <input value={String(profile.orderCount)} disabled />
                  </div>
                  <div className="form-field">
                    <label>Họ tên *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Số điện thoại</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" />
                  </div>
                  <div className="form-field">
                    <label>Avatar URL</label>
                    <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  {infoErr && <p className="auth-error">{infoErr}</p>}
                  {infoMsg && <p style={{ color: 'var(--color-primary)' }}>{infoMsg}</p>}
                  <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={savingInfo}>
                    {savingInfo ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                  </button>
                </form>
              )}

              {/* Password tab */}
              {tab === 'password' && (
                <form onSubmit={handleChangePassword} className="auth-email-form">
                  <div className="form-field">
                    <label>Mật khẩu hiện tại *</label>
                    <input
                      type="password"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Mật khẩu mới * (tối thiểu 6 ký tự)</label>
                    <input
                      type="password"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="form-field">
                    <label>Xác nhận mật khẩu mới *</label>
                    <input
                      type="password"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      required
                    />
                  </div>
                  {pwdErr && <p className="auth-error">{pwdErr}</p>}
                  {pwdMsg && <p style={{ color: 'var(--color-primary)' }}>{pwdMsg}</p>}
                  <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={savingPwd}>
                    {savingPwd ? 'Đang đổi...' : '🔒 Đổi mật khẩu'}
                  </button>
                  <p style={{ fontSize: '.85rem', color: 'var(--color-text-muted)', marginTop: '.5rem' }}>
                    Lưu ý: Tài khoản đăng nhập qua Google/Facebook/SĐT chưa có mật khẩu — không thể đổi qua đây.
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};
