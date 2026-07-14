// Embedded configuration for deployment
// Uses environment variables with fallbacks for development

export const config = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/lottery_db",
  
  // SMTP Configuration for Email Verification
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_USER: process.env.SMTP_USER || "yamaas084@gmail.com",
  SMTP_PASS: process.env.SMTP_PASS || "lybh hdhg esnv looa",
  SMTP_FROM: process.env.SMTP_FROM || "selling <yamaas084@gmail.com>",
  SMTP_PORT: process.env.SMTP_PORT || "465",
  SMTP_SECURE: process.env.SMTP_SECURE || "true",
  
  // Render.com Detection
  isRender: process.env.RENDER === 'true' || process.env.RENDER_SERVICE_ID,
};
