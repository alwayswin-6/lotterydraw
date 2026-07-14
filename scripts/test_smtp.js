import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import sgMail from '@sendgrid/mail';

(async function(){
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  console.log('Using SendGrid settings:', { apiKey: apiKey ? '***SET***' : 'NOT SET', fromEmail });

  if (!apiKey) {
    console.error('SENDGRID_API_KEY is not set in .env.local');
    process.exit(1);
  }

  if (!fromEmail) {
    console.error('SENDGRID_FROM_EMAIL is not set in .env.local');
    process.exit(1);
  }

  try {
    sgMail.setApiKey(apiKey);
    
    // Test by sending a simple test email
    const testEmail = process.env.TEST_EMAIL || fromEmail;
    
    const msg = {
      to: testEmail,
      from: fromEmail,
      subject: 'SendGrid Test Email',
      text: 'This is a test email from your SendGrid configuration.',
      html: '<strong>This is a test email from your SendGrid configuration.</strong>',
    };

    console.log(`Sending test email to ${testEmail}...`);
    await sgMail.send(msg);
    console.log('SendGrid test email sent successfully');
  } catch (err) {
    console.error('SendGrid test failed:', err && err.message ? err.message : err);
    if (err && err.response) console.error('Response:', err.response);
    process.exit(1);
  }
})();
