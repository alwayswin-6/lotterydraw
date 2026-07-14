SendGrid Email Setup and Testing

This project implements `sendVerificationEmail` in `src/lib/email.ts` using SendGrid's API and exposes `/api/send-verification-email` on the server.

What I added:
- `.env.local` (gitignored) with SendGrid values for local development.
- `render.yaml` declared SendGrid-related env keys (no secrets committed).
- `package.json` includes `@sendgrid/mail` dependency for email sending.

How to set up SendGrid

1. Create a SendGrid account at https://sendgrid.com/
2. Generate an API Key in your SendGrid dashboard (Settings > API Keys)
3. Verify your sender identity (Settings > Sender Authentication) - you can use single sender verification for testing
4. Copy your API Key and note your verified sender email address

How to configure locally

1. Ensure `.env.local` is present in the project root with your SendGrid credentials. The file should contain:

```
SENDGRID_API_KEY=your_actual_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email@example.com
```

2. Replace the placeholder values with your actual SendGrid API key and verified sender email.

How to test locally

1. Test your SendGrid configuration using the test script:

```bash
node scripts/test_smtp.js
```

This will send a test email to verify your SendGrid setup is working.

2. Start the server (this will load `.env.local`):

```bash
npm run build
npm start
```

3. In the web UI, sign up using a test email. The client will call `/api/send-verification-email` with a 6-digit code, which the server will send using SendGrid.

Notes and safety

- Never commit `.env.local` or secrets to source control. `.env*` is added to `.gitignore`.
- For deployment, configure the SendGrid environment variables securely in your hosting provider (Render, etc.). `render.yaml` declares the variables so you can sync them via the dashboard or CLI.
- SendGrid API keys should be treated as sensitive credentials - never share them publicly.
- The free SendGrid tier allows up to 100 emails per day, which is sufficient for testing and small applications.
