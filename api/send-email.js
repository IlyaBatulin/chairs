const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, cartItems, comment } = req.body;

  // SMTP для REG.RU
  const transporter = nodemailer.createTransport({
    host: 'smtp.ruskreslo.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'info@ruskreslo.ru',
      pass: '08032009Mm-+',
    },
  });

  try {
    await transporter.sendMail({
      from: 'info@ruskreslo.ru',
      to: 'info@ruskreslo.ru',
      subject: 'Новый заказ с сайта',
      text: `\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nТовары: ${cartItems}\nКомментарий: ${comment || '-'}\n`,
    });
    res.status(200).json({ message: 'Письмо отправлено!' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка отправки: ' + error.message });
  }
}; 