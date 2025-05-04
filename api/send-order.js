import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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

    console.log('Создание транспортера с настройками:');
    console.log('- Host:', 'mail.ruskreslo.ru');
    console.log('- Port:', 465);
    console.log('- Secure:', true);
    console.log('- User:', process.env.EMAIL_USER ? 'Установлен' : 'НЕ УСТАНОВЛЕН');
    console.log('- Pass:', process.env.EMAIL_PASS ? 'Установлен' : 'НЕ УСТАНОВЛЕН');

    // Создаем транспортер для отправки писем
    // Настройки для почтового сервера ruskreslo.ru
    // Переменные окружения в Vercel:
    //    - EMAIL_USER: info@ruskreslo.ru
    //    - EMAIL_PASS: пароль от почтового ящика
    const transporter = nodemailer.createTransport({
      host: 'mail.ruskreslo.ru',
      port: 465,
      secure: true, // true для порта 465 (SSL/TLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('Отправка письма...');
    // Отправляем письмо
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // info@ruskreslo.ru
      to: 'info@ruskreslo.ru', // Адрес для получения заказов
      subject: 'Новый заказ с сайта',
      text: message,
      replyTo: data.email
    });

    console.log('Письмо отправлено успешно:', info.messageId);
    res.status(200).json({ success: true, message: 'Заказ успешно отправлен' });
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    console.error('Детали ошибки:', error.message);
    if (error.code) console.error('Код ошибки:', error.code);
    res.status(500).json({ success: false, message: 'Ошибка при отправке заказа: ' + error.message });
  }
} 