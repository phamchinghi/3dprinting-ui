import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';

interface PhoneOtpFormProps {
  isRegister: boolean;
  onVerified: (phone: string, name?: string) => void;
  labels: {
    phonePlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    sendOtp: string;
    otpHint: string;
    verify: string;
    resend: string;
    change: string;
    sending: string;
    verifying: string;
  };
}

const OTP_LENGTH = 6;
const DEMO_OTP = '123456';

export const PhoneOtpForm = ({ isRegister, onVerified, labels }: PhoneOtpFormProps) => {
  const [phone, setPhone]       = useState('');
  const [name, setName]         = useState('');
  const [step, setStep]         = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp]           = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError]       = useState('');
  const [sending, setSending]   = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs               = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Số điện thoại không hợp lệ');
      return;
    }
    setError('');
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setStep('otp');
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (digits.length) {
      const next = [...otp];
      digits.split('').forEach((d, i) => { next[i] = d; });
      setOtp(next);
      inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError('Nhập đủ 6 số'); return; }
    if (code !== DEMO_OTP) { setError('Mã OTP không đúng. Demo: 123456'); return; }
    setError('');
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifying(false);
    onVerified(phone, isRegister ? name : undefined);
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setStep('phone');
  };

  if (step === 'phone') {
    return (
      <div className="auth-phone-form">
        {isRegister && (
          <div className="form-field">
            <label>{labels.nameLabel}</label>
            <input
              type="text"
              placeholder={labels.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="form-field">
          <label>Số điện thoại</label>
          <div className="phone-input-wrap">
            <span className="phone-prefix">🇻🇳 +84</span>
            <input
              type="tel"
              placeholder={labels.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
            />
          </div>
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn btn-primary btn-block btn-lg" onClick={handleSendOtp} disabled={sending}>
          {sending ? labels.sending : labels.sendOtp}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-phone-form">
      <p className="otp-sent-msg">
        Đã gửi OTP đến <strong>{phone}</strong>
      </p>
      <p className="otp-hint">{labels.otpHint}</p>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKey(idx, e)}
            onPaste={handleOtpPaste}
            className={`otp-box ${digit ? 'filled' : ''}`}
            autoFocus={idx === 0}
          />
        ))}
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button className="btn btn-primary btn-block btn-lg" onClick={handleVerify} disabled={verifying}>
        {verifying ? labels.verifying : labels.verify}
      </button>
      <div className="otp-actions">
        <button type="button" className="link-btn" onClick={handleResend}>{labels.resend}</button>
        <button type="button" className="link-btn" onClick={() => { setStep('phone'); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }}>
          {labels.change}
        </button>
      </div>
    </div>
  );
};
