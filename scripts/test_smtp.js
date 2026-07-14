import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import nodemailer from 'nodemailer';

(async function(){
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  console.log('Using SMTP settings:', { smtpHost, smtpUser, smtpPort, smtpSecure, passSet: !!smtpPass });

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();
    console.log('SMTP verify succeeded');
  } catch (err) {
    console.error('SMTP verify failed:', err && err.message ? err.message : err);
    if (err && err.response) console.error('Response:', err.response);
    process.exit(1);
  }
})();
