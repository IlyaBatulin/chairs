const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Настраиваем расширенные CORS-заголовки для любого домена
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Обработка preflight-запросов OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен', success: false });
  }

  try {
    const { name, email, phone, cartItems, subject, pageType } = req.body;
    
    console.log('Получен запрос на отправку email:', req.body);
    
    if (!name || !email || !phone || !cartItems) {
      console.error('Неполные данные для отправки:', req.body);
      return res.status(400).json({ 
        error: 'Не все обязательные поля заполнены', 
        success: false,
        received: req.body 
      });
    }
    
    // Настройка транспорта email
    const transporter = nodemailer.createTransport({
      host: 'mail.hosting.reg.ru', // SMTP сервер REG.RU
      port: 465,
      secure: true,
      auth: {
        user: 'info@ruskreslo.ru', // Адрес почты на REG.RU
        pass: '08032009Mm-+' // Пароль от почты
      },
      tls: {
        rejectUnauthorized: false // Принимаем все сертификаты
      }
    });
    
    // Тестируем соединение перед отправкой
    try {
      await transporter.verify();
      console.log('SMTP соединение успешно установлено');
    } catch (verifyError) {
      console.error('Ошибка проверки SMTP соединения:', verifyError);
      return res.status(500).json({ 
        error: 'Не удалось подключиться к почтовому серверу', 
        success: false,
        details: verifyError.message 
      });
    }
    
    // Формируем тему письма в зависимости от типа страницы
    const emailSubject = pageType === 'massage' 
      ? 'Новый заказ (Кресла с массажем)' 
      : 'Новый заказ (Детские растущие кресла)';
    
    // Отправляем письмо
    try {
      const mailResult = await transporter.sendMail({
        from: 'info@ruskreslo.ru', // Должно совпадать с user в transporter
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
      
      console.log('Письмо успешно отправлено:', mailResult);
      return res.status(200).json({ 
        success: true, 
        message: 'Письмо успешно отправлено',
        messageId: mailResult.messageId
      });
    } catch (sendError) {
      console.error('Ошибка отправки письма:', sendError);
      return res.status(500).json({ 
        error: 'Ошибка отправки письма', 
        success: false,
        details: sendError.message 
      });
    }
  } catch (error) {
    console.error('Общая ошибка обработки запроса:', error);
    return res.status(500).json({ 
      error: 'Ошибка сервера', 
      success: false,
      details: error.message 
    });
  }
}; 