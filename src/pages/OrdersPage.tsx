import { Link, Navigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/i18n/LanguageContext';
import { getOrders } from '@/data/orders';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

const StatusBadge = ({ status, label }: { status: Order['status']; label: string }) => {
  const colors: Record<Order['status'], string> = {
    pending:   'status-pending',
    confirmed: 'status-confirmed',
    shipped:   'status-shipped',
    delivered: 'status-delivered',
  };
  return <span className={`order-status-badge ${colors[status]}`}>{label}</span>;
};

export const OrdersPage = () => {
  const { user } = useAuth();
  const { t } = useLang();

  if (!user) return <Navigate to="/auth" replace />;

  const orders = getOrders();

  return (
    <>
      <Breadcrumb
        title={t.orders.title}
        crumbs={[{ label: t.nav.home, to: '/' }, { label: t.orders.breadcrumb }]}
      />
      <section className="section">
        <div className="container">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <h2>{t.orders.empty}</h2>
              <p>{t.orders.emptyDesc}</p>
              <Link to="/shop" className="btn btn-primary">{t.orders.startShopping}</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-meta">
                      <span className="order-id">{t.orders.orderId}: <strong>{order.id}</strong></span>
                      <span className="order-date">{t.orders.date}: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <StatusBadge status={order.status} label={t.orders.statusLabels[order.status]} />
                  </div>

                  <div className="order-items-preview">
                    {order.items.map(({ product, quantity }) => (
                      <div key={product.id} className="order-item-row">
                        <span className="order-item-emoji">{product.emoji}</span>
                        <span className="order-item-name">{product.name}</span>
                        <span className="order-item-qty">× {quantity}</span>
                        <span className="order-item-price">{formatPrice(product.price * quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-footer-meta">
                      <span>{t.orders.paymentMethod}: <strong>{t.orders.paymentLabels[order.paymentMethod]}</strong></span>
                      <span>{t.orders.shippingTo}: <strong>{order.customer.address}, {order.customer.district}, {order.customer.province}</strong></span>
                    </div>
                    <div className="order-total">
                      {t.orders.total}: <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
