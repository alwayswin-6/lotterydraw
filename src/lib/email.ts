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
      subject: "Email Verification Code",
      text: `Your verification code is: ${code}\n\nEnter this code to complete your registration. This code expires in 10 minutes.\n\nIf you did not request this code, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <p>Please verify your email address by entering the code below:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px;">
            <div style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px; color: #333;">
              ${code}
            </div>
          </div>
          
          <p style="font-size: 12px; color: #666;">This code expires in 10 minutes.</p>
          <p style="font-size: 12px; color: #666;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
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
