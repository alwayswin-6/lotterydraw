import sgMail from "@sendgrid/mail";
import { config } from "../config";

interface VerificationEmail {
  email: string;
  code: string;
}

export async function sendVerificationEmail({ email, code }: VerificationEmail) {
  try {
    const apiKey = config.SENDGRID_API_KEY;
    const fromEmail = config.SENDGRID_FROM_EMAIL;

    if (!apiKey) throw new Error("SENDGRID_API_KEY is not configured in embedded config");
    if (!fromEmail) throw new Error("SENDGRID_FROM_EMAIL is not configured in embedded config");

    console.log("=== SendGrid Configuration Debug ===");
    console.log(`SENDGRID_API_KEY: ${apiKey ? '***SET***' : 'NOT SET'}`);
    console.log(`SENDGRID_FROM_EMAIL: ${fromEmail}`);
    console.log(`Target Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log("================================");

    sgMail.setApiKey(apiKey);

    console.log(`Attempting to send verification email to ${email} via SendGrid`);

    const msg = {
      to: email,
      from: fromEmail,
      subject: code,
      text: code,
      html: code,
      headers: {
        "X-Priority": "3",
        "X-Mailer": "SendGrid",
        "Precedence": "bulk"
      },
      trackingSettings: {
        clickTracking: { enabled: false },
        openTracking: { enabled: false },
        subscriptionTracking: { enabled: false }
      }
    };

    await sgMail.send(msg);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    if (error instanceof Error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
    throw new Error("Email sending failed due to unknown error");
  }
}
