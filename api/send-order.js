import sgMail from '@sendgrid/mail';

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

    // Проверяем наличие API ключа SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      console.error('Ошибка: API ключ SendGrid не установлен');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка конфигурации сервера: API ключ не настроен' 
      });
    }

    console.log('Настройка SendGrid...');
    // Устанавливаем API ключ SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    console.log('Отправка письма...');
    // Подготавливаем данные письма
    const msg = {
      to: 'info@ruskreslo.ru', // Адрес получателя
      from: process.env.EMAIL_FROM || 'info@ruskreslo.ru', // Адрес отправителя
      subject: 'Новый заказ с сайта',
      text: message,
      replyTo: data.email
    };

    // Отправляем письмо
    await sgMail.send(msg);

    console.log('Письмо отправлено успешно');
    res.status(200).json({ success: true, message: 'Заказ успешно отправлен' });
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    if (error.response) {
      console.error('Детали ошибки SendGrid:', error.response.body);
    }
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке заказа: ' + (error.message || 'Неизвестная ошибка') 
    });
  }
} 