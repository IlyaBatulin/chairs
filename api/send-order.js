import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('API-маршрут /api/send-order запущен');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Метод не разрешен' });
  }

  try {
    const data = req.body;
    console.log('Получены данные заказа:', JSON.stringify(data));

    // Проверяем наличие всех необходимых данных
    if (!data.name || !data.email || !data.phone || !data.items) {
      console.log('Ошибка валидации: не все поля заполнены');
      return res.status(400).json({ success: false, message: 'Не все данные заполнены' });
    }

    // Формируем текст письма
    let message = "Новый заказ!\n\n";
    message += `Имя: ${data.name}\n`;
    message += `Email: ${data.email}\n`;
    message += `Телефон: ${data.phone}\n\n`;

    if (data.comment) {
      message += `Комментарий к заказу: ${data.comment}\n\n`;
    }

    message += "Товары в заказе:\n";
    data.items.forEach(item => {
      message += `- ${item.name}\n`;
    });

    // Проверяем наличие переменных окружения
    console.log('Проверка переменных окружения:');
    console.log('- EMAIL_USER существует:', !!process.env.EMAIL_USER);
    console.log('- EMAIL_PASS существует:', !!process.env.EMAIL_PASS);
    console.log('- EMAIL_USER значение:', process.env.EMAIL_USER);
    
    // Закрываем пароль для безопасности, но проверяем его наличие
    if (!process.env.EMAIL_PASS) {
      console.error('Ошибка: EMAIL_PASS не установлен');
      return res.status(500).json({ success: false, message: 'Ошибка конфигурации: EMAIL_PASS не установлен' });
    }

    // Создаем тестовый транспортер для проверки соединения
    console.log('Создание транспортера для тестирования соединения...');
    try {
      // Пробуем сначала порт 465 (SSL)
      console.log('Тестирование порта 465 с SSL...');
      const testConfig = {
        host: 'mail.ruskreslo.ru',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        debug: true
      };
      
      const transporter = nodemailer.createTransport(testConfig);
      
      console.log('Проверка соединения с почтовым сервером...');
      const verifyResult = await transporter.verify();
      console.log('Соединение проверено:', verifyResult);

      console.log('Отправка письма...');
      // Отправляем письмо
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, 
        to: 'info@ruskreslo.ru',
        subject: 'Новый заказ с сайта',
        text: message,
        replyTo: data.email
      });

      console.log('Письмо отправлено успешно:', info.messageId);
      res.status(200).json({ success: true, message: 'Заказ успешно отправлен' });
    } catch (smtpError) {
      console.error('Ошибка при подключении к SMTP на порту 465:', smtpError.message);
      
      // Пробуем альтернативный порт 587 (TLS)
      console.log('Тестирование порта 587 с TLS...');
      try {
        const altTransporter = nodemailer.createTransport({
          host: 'mail.ruskreslo.ru',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          debug: true
        });
        
        console.log('Проверка соединения с альтернативным портом...');
        const altVerify = await altTransporter.verify();
        console.log('Соединение с портом 587 проверено:', altVerify);
        
        console.log('Отправка письма через порт 587...');
        const info = await altTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'info@ruskreslo.ru',
          subject: 'Новый заказ с сайта',
          text: message,
          replyTo: data.email
        });
        
        console.log('Письмо отправлено успешно через порт 587:', info.messageId);
        res.status(200).json({ success: true, message: 'Заказ успешно отправлен' });
      } catch (altError) {
        console.error('Ошибка при подключении к SMTP на порту 587:', altError.message);
        throw new Error(`Не удалось подключиться к SMTP-серверу ни через порт 465, ни через порт 587. Ошибки: 465 - ${smtpError.message}, 587 - ${altError.message}`);
      }
    }
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    console.error('Детали ошибки:', error.message);
    if (error.code) console.error('Код ошибки:', error.code);
    if (error.response) console.error('Ответ сервера:', error.response);
    
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке заказа: ' + error.message,
      details: error.code ? `Код ошибки: ${error.code}` : 'Нет кода ошибки'
    });
  }
} 