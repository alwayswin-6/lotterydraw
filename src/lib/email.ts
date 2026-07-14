import nodemailer from "nodemailer";

interface VerificationEmail {
  email: string;
  code: string;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getSmtpPort() {
  return Number(process.env.SMTP_PORT ?? 587);
}

function getSmtpSecure() {
  if (process.env.SMTP_SECURE) return process.env.SMTP_SECURE === "true";
  return getSmtpPort() === 465;
}

export async function sendVerificationEmail({ email, code }: VerificationEmail) {
  try {
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
    if (!from) throw new Error("SMTP_FROM or SMTP_USER is not configured");

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = process.env.SMTP_PORT;
    const smtpSecure = process.env.SMTP_SECURE;
    
    console.log("=== SMTP Configuration Debug ===");
    console.log(`SMTP_HOST: ${smtpHost}`);
    console.log(`SMTP_USER: ${smtpUser}`);
    console.log(`SMTP_PASS: ${smtpPass ? '***SET***' : 'NOT SET'}`);
    console.log(`SMTP_PORT: ${smtpPort}`);
    console.log(`SMTP_SECURE: ${smtpSecure}`);
    console.log(`SMTP_FROM: ${from}`);
    console.log(`Target Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log("================================");
    
    if (!smtpHost) throw new Error("SMTP_HOST environment variable is not configured");
    if (!smtpUser) throw new Error("SMTP_USER environment variable is not configured");
    if (!smtpPass) throw new Error("SMTP_PASS environment variable is not configured");

    console.log(`Attempting to send verification email to ${email} via SMTP host: ${smtpHost}`);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: getSmtpPort(),
      secure: getSmtpSecure(),
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "🎰 Your Lucky Verification Code - Unlock Your Lottery Experience",
      text: `Your verification code is ${code}. Enter this code to complete your registration and start exploring our lottery prizes.`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;color:#0a1628;background:linear-gradient(135deg,#0a1628 0%,#1a2744 100%);padding:40px 20px">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(232,168,56,0.3)">
            <!-- Header with Lottery Theme -->
            <div style="background:linear-gradient(135deg,#e8a838 0%,#f5c763 100%);padding:40px 30px;text-align:center">
              <div style="font-size:48px;margin-bottom:10px">🎰</div>
              <h1 style="margin:0;color:#0a1628;font-size:28px;font-weight:800;letter-spacing:-0.5px">Your Lucky Moment Awaits</h1>
              <p style="margin:10px 0 0;color:#0a1628;font-size:16px;opacity:0.8">Verify your account to unlock exclusive lottery prizes</p>
            </div>
            
            <!-- Main Content -->
            <div style="padding:40px 30px">
              <p style="margin:0 0 20px;font-size:16px;color:#4a5568">You're one step away from discovering amazing lottery prizes! Enter your verification code below to complete your registration:</p>
              
              <!-- Verification Code Box -->
              <div style="background:linear-gradient(135deg,#0a1628 0%,#1a2744 100%);border-radius:16px;padding:30px;text-align:center;margin:30px 0;box-shadow:0 10px 30px rgba(10,22,40,0.2)">
                <p style="margin:0 0 15px;color:#e8a838;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Your Verification Code</p>
                <div style="font-size:42px;font-weight:800;letter-spacing:8px;color:#ffffff;margin:0;font-family:'Courier New',monospace">${code}</div>
                <p style="margin:15px 0 0;color:#ffffff;font-size:12px;opacity:0.6">Valid for 10 minutes</p>
              </div>
              
              <!-- Excitement Elements -->
              <div style="display:flex;justify-content:center;gap:15px;margin:30px 0">
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">🏆</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Grand Prizes</div>
                </div>
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">💎</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Premium Rewards</div>
                </div>
                <div style="background:#fff7ed;border:2px solid #e8a838;border-radius:12px;padding:15px 20px;text-align:center;flex:1">
                  <div style="font-size:24px;margin-bottom:5px">🎁</div>
                  <div style="font-size:12px;font-weight:600;color:#0a1628">Daily Draws</div>
                </div>
              </div>
              
              <p style="margin:20px 0 0;font-size:14px;color:#718096">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f7fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="margin:0;font-size:12px;color:#718096">© 2024 Linz Lottery Platform. Your luck starts here!</p>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    if (error instanceof Error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
    throw new Error("Email sending failed due to unknown error");
  }
}
