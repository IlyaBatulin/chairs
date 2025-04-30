import Image from 'next/image';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="product-card bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative w-full h-64">
        <Image
          src={image}
          alt={name}
          fill
          className="product-image object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="product-info p-4">
        <h3 className="product-title text-lg font-semibold text-gray-800">{name}</h3>
        <p className="product-price text-xl font-bold text-blue-600">{price.toLocaleString('ru-RU')} ₽</p>
        <button
          onClick={() => addToCart({ id, name, price, image, quantity: 1 })}
          className="add-to-cart w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
} 