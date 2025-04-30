import { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const products = [
  {
    id: 1,
    name: 'Офисное кресло "Комфорт"',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Геймерское кресло "Про"',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Детское кресло "Радуга"',
    price: 8990,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    name: 'Кресло-качалка "Уют"',
    price: 18990,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    name: 'Компьютерное кресло "Стандарт"',
    price: 15990,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    name: 'Кресло для руководителя "Престиж"',
    price: 34990,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="hero">
            <h1>Добро пожаловать в магазин кресел</h1>
            <p>Выберите идеальное кресло для вашего комфорта</p>
          </div>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Поиск кресел..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 