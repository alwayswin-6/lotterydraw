// Embedded configuration for deployment
// Uses environment variables with fallbacks for development

export const config = {
  // Database Configuration (only use PostgreSQL if explicitly configured)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // SendGrid Configuration for Email Verification
  // To maximize deliverability, add these DNS records to your domain registrar:
  // 1. SPF record: v=spf1 sendgrid.net ~all
  // 2. DKIM: Follow SendGrid's Sender Authentication guide
  // 3. DMARC: v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain
  // Go to SendGrid > Sender Authentication to generate exact records for your domain
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || "noreply@lotterydraw.work.gd",
  
  // Render.com Detection
  isRender: process.env.RENDER === 'true' || process.env.RENDER_SERVICE_ID,
};
