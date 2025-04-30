import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Chairs Store
        </Link>
        <Link href="/cart" className="nav-cart">
          Корзина
          {itemCount > 0 && (
            <span className="cart-count">{itemCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
} 