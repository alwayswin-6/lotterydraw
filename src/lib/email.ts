import nodemailer from "nodemailer";
import { config } from "../config";

interface VerificationEmail {
  email: string;
  code: string;
}

function normalizeEnvValue(value: string) {
  return value.trim().replace(/^\"(.+)\"$/s, "$1").replace(/^'(.*)'$/s, "$1");
}

function getRequiredConfig(name: string, value: string) {
  if (!value) throw new Error(`${name} is not configured in embedded config`);
  return normalizeEnvValue(value);
}

function getSmtpPort() {
  const portValue = config.SMTP_PORT ? normalizeEnvValue(config.SMTP_PORT) : "587";
  return Number(portValue);
}

function getSmtpSecure() {
  if (config.SMTP_SECURE) return config.SMTP_SECURE === "true";
  return getSmtpPort() === 465;
}

export async function sendVerificationEmail({ email, code }: VerificationEmail) {
  try {
    const from = config.SMTP_FROM || config.SMTP_USER;
    if (!from) throw new Error("SMTP_FROM or SMTP_USER is not configured in embedded config");

    const smtpHost = config.SMTP_HOST;
    const smtpUser = config.SMTP_USER;
    const smtpPass = config.SMTP_PASS;
    const smtpPort = config.SMTP_PORT;
    const smtpSecure = config.SMTP_SECURE;
    
    console.log("=== SMTP Configuration Debug ===");
    console.log(`SMTP_HOST: ${smtpHost || 'NOT SET'}`);
    console.log(`SMTP_USER: ${smtpUser || 'NOT SET'}`);
    console.log(`SMTP_PASS: ${smtpPass ? '***SET***' : 'NOT SET'}`);
    console.log(`SMTP_PORT: ${smtpPort || '587 (default)'}`);
    console.log(`SMTP_SECURE: ${smtpSecure || 'auto'}`);
    console.log(`SMTP_FROM: ${from}`);
    console.log(`Target Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log("================================");
    
    if (!smtpHost) throw new Error("SMTP_HOST is not configured in embedded config");
    if (!smtpUser) throw new Error("SMTP_USER is not configured in embedded config");
    if (!smtpPass) throw new Error("SMTP_PASS is not configured in embedded config");

    console.log(`Attempting to send verification email to ${email} via SMTP host: ${smtpHost}`);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: getSmtpPort(),
      secure: getSmtpSecure(),
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // VPN-friendly connection settings
      connectionTimeout: 15000, // Increased timeout for VPN connections
      greetingTimeout: 10000,  // Increased greeting timeout
      socketTimeout: 15000,    // Increased socket timeout
      tls: {
        servername: smtpHost,
        rejectUnauthorized: false, // More permissive for VPN scenarios
        minVersion: 'TLSv1.2', // Ensure modern TLS
      },
      // Allow both IPv4 and IPv6, with fallback
      dns: {
        // Use system DNS which VPNs typically configure
        family: undefined, // Let system decide IPv4 vs IPv6
      },
    } as any);

    // Test connection before sending
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP connection verification failed:", verifyError);
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown error';
      
      // Check if it's an IPv6 connectivity error
      if (errorMessage.includes('ENETUNREACH') || errorMessage.includes('IPv6') || errorMessage.includes('2607:f8b0')) {
        throw new Error("Network error: Cannot connect to SMTP server. This may be due to IPv6 connectivity issues. If using a VPN, try disabling it temporarily or use an SMTP provider that supports IPv4.");
      }
      
      // Check for timeout errors (common with VPNs)
      if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
        throw new Error("Connection timeout: Cannot connect to SMTP server. If using a VPN, check your VPN settings or try connecting without VPN. The SMTP server may be blocking VPN connections.");
      }
      
      // Check for connection refused errors
      if (errorMessage.includes('ECONNREFUSED')) {
        throw new Error("Connection refused: SMTP server is not accessible. If using a VPN, your VPN may be blocking the connection. Try disabling VPN or check SMTP server settings.");
      }
      
      // Check for authentication errors
      if (errorMessage.includes('auth')) {
        throw new Error("Authentication failed: SMTP credentials are incorrect. If using a VPN, ensure your VPN allows SMTP traffic on the configured port.");
      }
      
      throw new Error(`SMTP connection failed: ${errorMessage}`);
    }

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
      // Provide more specific error messages for common issues
      if (error.message.includes("ETIMEDOUT") || error.message.includes("timeout")) {
        throw new Error("Email server connection timed out. Please check your SMTP settings and network connection.");
      }
      if (error.message.includes("ECONNREFUSED")) {
        throw new Error("Could not connect to email server. Please check SMTP_HOST and SMTP_PORT.");
      }
      if (error.message.includes("auth")) {
        throw new Error("Email authentication failed. Please check SMTP_USER and SMTP_PASS.");
      }
      throw new Error(`Email sending failed: ${error.message}`);
    }
    throw new Error("Email sending failed due to unknown error");
  }
}
