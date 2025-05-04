const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, cartItems, comment } = req.body;

  // SMTP для Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'batulinilya5@gmail.com',
      pass: 'mitl lcrr jjft pbtg',
    },
  });

  try {
    await transporter.sendMail({
      from: 'batulinilya5@gmail.com',
      to: 'info@ruskreslo.ru',
      subject: 'Новый заказ с сайта',
      text: `\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nТовары: ${cartItems}\nКомментарий: ${comment || '-'}\n`,
    });
    res.status(200).json({ message: 'Письмо отправлено!' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка отправки: ' + error.message });
  }
}; 