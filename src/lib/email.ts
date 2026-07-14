import { config } from "../config";

interface VerificationEmail {
  email: string;
  code: string;
}

export async function sendVerificationEmail({ email, code }: VerificationEmail) {
  try {
    const apiKey = config.SENDGRID_API_KEY;
    const from = config.SENDGRID_FROM;
    
    console.log("=== SendGrid Configuration Debug ===");
    console.log(`SENDGRID_API_KEY: ${apiKey ? '***SET***' : 'NOT SET'}`);
    console.log(`SENDGRID_FROM: ${from || 'NOT SET'}`);
    console.log(`Target Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log("================================");
    
    if (!apiKey) throw new Error("SENDGRID_API_KEY is not configured in embedded config");
    if (!from) throw new Error("SENDGRID_FROM is not configured in embedded config");

    console.log(`Attempting to send verification email to ${email} via SendGrid API`);

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            subject: "🎰 Your Lucky Verification Code - Unlock Your Lottery Experience",
          },
        ],
        from: { email: from, name: "Linz Lottery" },
        content: [
          {
            type: "text/plain",
            value: `Your verification code is ${code}. Enter this code to complete your registration and start exploring our lottery prizes.`,
          },
          {
            type: "text/html",
            value: `
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
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid API error:", errorText);
      throw new Error(`SendGrid API failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`Verification email sent successfully to ${email} via SendGrid`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    if (error instanceof Error) {
      // Provide specific error messages for common issues
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        throw new Error("SendGrid authentication failed: Invalid API key. Please check your SENDGRID_API_KEY configuration.");
      }
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        throw new Error("SendGrid access denied: Your API key may not have permission to send emails. Check your SendGrid API key permissions.");
      }
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        throw new Error("SendGrid rate limit exceeded: You've sent too many emails. Please wait and try again later.");
      }
      throw new Error(`Email sending failed: ${error.message}`);
    }
    throw new Error("Email sending failed due to unknown error");
  }
}
