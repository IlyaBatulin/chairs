const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Метод не разрешен' });
  }

  try {
    const data = req.body;

    // Проверяем наличие всех необходимых данных
    if (!data.name || !data.email || !data.phone || !data.items) {
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

    // Создаем транспортер для отправки писем
    // Для работы нужно:
    // 1. Включить двухфакторную аутентификацию в Gmail
    // 2. Создать пароль приложения в настройках безопасности Google
    // 3. Установить переменные окружения в Vercel:
    //    - EMAIL_USER: ваш Gmail адрес
    //    - EMAIL_PASS: пароль приложения
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Отправляем письмо
    // Измените email ниже на тот, куда должны приходить заказы
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ilyabatulin22@gmail.com', // Замените на нужный email
      subject: 'Новый заказ с сайта',
      text: message,
      replyTo: data.email
    });

    res.status(200).json({ success: true, message: 'Заказ успешно отправлен' });
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    res.status(500).json({ success: false, message: 'Ошибка при отправке заказа' });
  }
} 