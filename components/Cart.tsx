import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ваша корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="relative w-full md:w-48 h-48">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="cart-item-image"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
                <div className="cart-item-details">
                  <div>
                    <h2 className="cart-item-title">{item.name}</h2>
                    <p className="cart-item-price">{item.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        aria-label="Уменьшить количество"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="quantity-input"
                        aria-label="Количество"
                      />
                      <button
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Удалить товар"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              Итого: {total.toLocaleString('ru-RU')} ₽
            </div>
            <button className="checkout-button">
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
} 