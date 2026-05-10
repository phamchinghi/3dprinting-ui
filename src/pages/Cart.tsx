import { Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CartItem } from '@/components/CartItem';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/i18n/LanguageContext';
import { formatPrice } from '@/utils/format';

export const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const { t } = useLang();
  const shipping = items.length > 0 ? 30000 : 0;
  const total    = subtotal + shipping;

  return (
    <>
      <Breadcrumb
        title={t.cart.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.cart.title }]}
      />
      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🛒</div>
              <h2>{t.cart.empty}</h2>
              <p>{t.cart.emptyDesc}</p>
              <Link to="/shop" className="btn btn-primary">{t.cart.startShopping}</Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>{t.cart.product}</th>
                      <th>{t.cart.price}</th>
                      <th>{t.cart.quantity}</th>
                      <th>{t.cart.subtotalCol}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <CartItem
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <Link to="/shop" className="btn btn-ghost">{t.common.backToShop}</Link>
                  <button className="btn btn-outline" onClick={clear}>{t.cart.clearCart}</button>
                </div>
              </div>

              <aside className="summary-card">
                <h3>{t.cart.orderSummary}</h3>
                <div className="summary-row"><span>{t.cart.subtotal}</span><span>{formatPrice(subtotal)}</span></div>
                <div className="summary-row"><span>{t.cart.shipping}</span><span>{formatPrice(shipping)}</span></div>
                <div className="summary-row total">
                  <span>{t.cart.total}</span><span>{formatPrice(total)}</span>
                </div>
                <Link to="/checkout" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1rem' }}>
                  {t.cart.checkout}
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
