const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Разрешаем CORS для вашего домена
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { name, email, phone, cartItems, subject, pageType } = req.body;
    
    console.log('Получен запрос на отправку email:', { name, email, phone, subject, pageType });
    
    // Настройка транспорта email
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru', // или другой SMTP сервер
      port: 465,
      secure: true,
      auth: {
        user: 'ваш_email@yandex.ru', // ВАЖНО: замените на вашу почту
        pass: 'ваш_пароль_приложения' // ВАЖНО: замените на пароль приложения
      }
    });
    
    // Формируем тему письма в зависимости от типа страницы
    const emailSubject = pageType === 'massage' 
      ? 'Новый заказ (Кресла с массажем)' 
      : 'Новый заказ (Детские растущие кресла)';
    
    // Отправляем письмо
    const mailResult = await transporter.sendMail({
      from: 'ваш_email@yandex.ru', // ВАЖНО: замените на вашу почту
      to: 'info@ruskreslo.ru',
      subject: subject || emailSubject,
      html: `
        <h2>Новый заказ с сайта</h2>
        <p><strong>Тип товара:</strong> ${pageType === 'massage' ? 'Кресла с массажем' : 'Детские растущие кресла'}</p>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <h3>Заказ:</h3>
        <pre>${cartItems}</pre>
      `
    });
    
    console.log('Письмо отправлено:', mailResult);
    return res.status(200).json({ success: true, message: 'Письмо успешно отправлено' });
  } catch (error) {
    console.error('Ошибка при отправке:', error);
    return res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
}; 