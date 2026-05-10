import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/utils/format';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { product, quantity } = item;
  return (
    <tr>
      <td>
        <div className="cart-item-info">
          <div className="cart-thumb">{product.emoji}</div>
          <div>
            <Link to={`/shop/${product.slug}`} style={{ fontWeight: 600 }}>
              {product.name}
            </Link>
            <div style={{ fontSize: '.85rem', color: 'var(--color-text-muted)' }}>
              {product.categoryLabel}
            </div>
          </div>
        </div>
      </td>
      <td>{formatPrice(product.price)}</td>
      <td>
        <div className="qty-control">
          <button onClick={() => onUpdateQuantity(product.id, quantity - 1)}>−</button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
          />
          <button onClick={() => onUpdateQuantity(product.id, quantity + 1)}>+</button>
        </div>
      </td>
      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
        {formatPrice(product.price * quantity)}
      </td>
      <td>
        <button className="cart-remove" onClick={() => onRemove(product.id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};
