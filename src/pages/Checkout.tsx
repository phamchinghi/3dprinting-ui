import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/i18n/LanguageContext';
import { formatPrice } from '@/utils/format';
import { saveOrder } from '@/data/orders';
import type { PaymentMethod } from '@/types';

export const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const { t } = useLang();
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cod');
  const shipping = items.length > 0 ? 30000 : 0;
  const total    = subtotal + shipping;

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <div className="icon">📦</div>
          <h2>{t.checkout.emptyCart}</h2>
          <p>{t.checkout.emptyCartDesc}</p>
          <Link to="/shop" className="btn btn-primary">{t.checkout.goShopping}</Link>
        </div>
      </section>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customer = {
      firstName: fd.get('firstName') as string,
      lastName:  fd.get('lastName')  as string,
      email:     fd.get('email')     as string,
      phone:     fd.get('phone')     as string,
      address:   fd.get('address')   as string,
      province:  fd.get('province')  as string,
      district:  fd.get('district')  as string,
      note:      (fd.get('note') as string) ?? '',
    };
    setSubmitting(true);
    setTimeout(() => {
      saveOrder({ items, subtotal, shipping, total, customer, paymentMethod: payMethod });
      clear();
      alert(t.checkout.successMsg);
      navigate('/orders');
    }, 600);
  };

  return (
    <>
      <Breadcrumb
        title={t.checkout.title}
        crumbs={[
          { label: t.nav.home, to: '/' },
          { label: t.cart.title, to: '/cart' },
          { label: t.checkout.title },
        ]}
      />
      <section className="section">
        <div className="container">
          <form onSubmit={handleSubmit} className="checkout-layout">
            <div>
              <h3>{t.checkout.shippingInfo}</h3>
              <div className="form-grid">
                <div className="form-field"><label>{t.checkout.firstName}</label><input name="firstName" required /></div>
                <div className="form-field"><label>{t.checkout.lastName}</label><input name="lastName" required /></div>
                <div className="form-field full"><label>{t.checkout.email}</label><input name="email" type="email" required /></div>
                <div className="form-field full"><label>{t.checkout.phone}</label><input name="phone" type="tel" required /></div>
                <div className="form-field full">
                  <label>{t.checkout.address}</label>
                  <input name="address" required placeholder={t.checkout.addressPlaceholder} />
                </div>
                <div className="form-field"><label>{t.checkout.province}</label><input name="province" required /></div>
                <div className="form-field"><label>{t.checkout.district}</label><input name="district" required /></div>
                <div className="form-field full">
                  <label>{t.checkout.note}</label>
                  <textarea name="note" rows={3} placeholder={t.checkout.notePlaceholder} />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem' }}>{t.checkout.paymentMethod}</h3>
              <div className="form-field"><label><input type="radio" name="pay" checked={payMethod === 'cod'}     onChange={() => setPayMethod('cod')}     /> {t.checkout.cod}</label></div>
              <div className="form-field"><label><input type="radio" name="pay" checked={payMethod === 'bank'}    onChange={() => setPayMethod('bank')}    /> {t.checkout.bankTransfer}</label></div>
              <div className="form-field"><label><input type="radio" name="pay" checked={payMethod === 'ewallet'} onChange={() => setPayMethod('ewallet')} /> {t.checkout.eWallet}</label></div>
            </div>

            <aside className="summary-card">
              <h3>{t.checkout.yourOrder}</h3>
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="summary-row">
                  <span>{product.emoji} {product.name} × {quantity}</span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
              <div className="summary-row" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '.5rem' }}>
                <span>{t.cart.subtotal}</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row"><span>{t.cart.shipping}</span><span>{formatPrice(shipping)}</span></div>
              <div className="summary-row total"><span>{t.cart.total}</span><span>{formatPrice(total)}</span></div>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: '1rem' }}
              >
                {submitting ? t.common.processing : t.common.orderNow}
              </button>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};
