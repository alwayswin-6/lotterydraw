// Embedded configuration for deployment
// Uses environment variables with fallbacks for development

export const config = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/lottery_db",
  
  // SendGrid Configuration for Email Verification
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM: process.env.SENDGRID_FROM || "yamaas084@gmail.com",
  
  // Render.com Detection
  isRender: process.env.RENDER === 'true' || process.env.RENDER_SERVICE_ID,
};
