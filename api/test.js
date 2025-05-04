export default function handler(req, res) {
  console.log('Тестовый API-маршрут вызван!');
  console.log('Метод запроса:', req.method);
  console.log('Заголовки:', JSON.stringify(req.headers));
  
  // Отправляем простой ответ
  res.status(200).json({ 
    success: true, 
    message: 'Тестовый API работает', 
    time: new Date().toISOString() 
  });
} 