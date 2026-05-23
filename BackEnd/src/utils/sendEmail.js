import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Dream Park <noreply@dreampark.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html // Optional HTML content
  };

  // 3) Send the email safely
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✨ Email sent successfully to: ${options.email}`);
  } catch (error) {
    // 🔑 هنا السحر: لو الإيميل فشل في الـ Dev، بنمنع الـ App إنه يضرب 500
    console.log('🔴 [Dream Park Email Service] Delivery failed, bypassing for local development.');
    
    // بنطبع محتوى الرسالة (اللي جواه الـ OTP) في الـ Terminal عندك عشان تشوفه
    console.log(`ℹ️ [DREAM PARK DEV] Email Content to [${options.email}]:\n-> Subject: ${options.subject}\n-> Message: ${options.message}`);
    
    // مش بنعمل throw error هنا.. بنسيبه يكمل بروح رياضية كأن الإيميل وصل!
  }
};

export default sendEmail;