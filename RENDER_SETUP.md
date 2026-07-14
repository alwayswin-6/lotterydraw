# Render.com Environment Configuration

This document explains how to configure environment variables for deployment on Render.com.

## Environment Configuration Priority

The application loads environment variables in the following order:

1. **Direct Environment Variables** (Production - Recommended): Set directly in Render.com dashboard
2. **File-based Configuration** (Development/Alternative): `.env.local` or `/etc/secrets/` files

## Render.com Setup (Recommended Approach)

### Using Direct Environment Variables

This is the standard and recommended approach for Render.com deployment:

1. Go to your Render.com dashboard
2. Select your service
3. Navigate to "Environment" tab
4. Add the following environment variables individually:

#### Required SMTP Variables (Email Verification)
```
SMTP_HOST=smtp.example.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=noreply@yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Database Variables (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Alternative: Using File Mounts

If you prefer file-based configuration (not recommended for Render.com):

1. Create your environment file locally with all required variables
2. In Render.com dashboard, go to your service settings
3. Add a "File Mount" from the "Advanced" section
4. Mount path: `/etc/secrets/`
5. Upload your environment file (e.g., `.env.local` or custom filename)
6. If using a custom filename, set `RENDER_ENV_FILE` environment variable (value should be the filename only, e.g. `.env.local` or `my.env`). The application will read `/etc/secrets/<RENDER_ENV_FILE>`.

**Note:** The application will prioritize direct environment variables over file-based configuration.

## Required Environment Variables

### Database (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### SMTP Configuration (Email Verification)
```
SMTP_HOST=smtp.example.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=noreply@yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Setting Environment Variables on Render.com

### Step-by-Step Instructions:

1. **Access Your Service Settings**
   - Log into Render.com dashboard
   - Select your web service
   - Click on "Environment" tab

2. **Add SMTP Variables**
   - Click "Add Environment Variable"
   - Add each SMTP variable individually:
     - Key: `SMTP_HOST`, Value: your SMTP server hostname
     - Key: `SMTP_USER`, Value: your SMTP username
     - Key: `SMTP_PASS`, Value: your SMTP password
     - Key: `SMTP_FROM`, Value: sender email address
     - Key: `SMTP_PORT`, Value: `587` (or your SMTP port)
     - Key: `SMTP_SECURE`, Value: `false` (for TLS) or `true` (for SSL)

3. **Add Database Variable**
   - If using Render PostgreSQL, `DATABASE_URL` is automatically set
   - For external database, add: Key: `DATABASE_URL`, Value: your connection string

4. **Deploy Changes**
   - Render will automatically redeploy when environment variables change
   - Check deployment logs to verify configuration

## Local Development

For local development, create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://localhost:5432/your_database
SMTP_HOST=smtp.example.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=noreply@yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Verification

The application logs environment configuration on startup. Check your Render.com logs:

**Direct Environment Variables (Production):**
```
Using direct environment variables (Render.com standard)
SMTP_HOST: SET
DATABASE_URL: SET
```

**File-based Configuration (Development):**
```
Checking environment files: [...]
Loaded environment from /path/to/.env.local
```

**No Configuration:**
```
Warning: No environment file found and no direct environment variables set.
SMTP and database features may not work.
```

## Troubleshooting

### Email Verification Not Working

1. **Check Environment Variables**
   - Verify all SMTP variables are set in Render.com dashboard
   - Ensure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` are present
   - Check deployment logs for configuration messages

2. **Verify SMTP Settings**
   - Confirm SMTP server allows connections from Render.com IPs
   - Check if SMTP port (587/465) is accessible
   - Test SMTP credentials with a local email client

3. **Check Application Logs**
   - Look for SMTP configuration debug output
   - Check for email sending errors in logs
   - Verify email sending is not blocked by spam filters

### Database Connection Issues

1. **Verify DATABASE_URL**
   - Check if PostgreSQL is internal or external to Render
   - For external databases, ensure connection string is correct
   - Verify database allows connections from Render.com IPs

2. **Check Network Access**
   - Ensure database is accessible from Render.com
   - Verify firewall rules allow connections
   - Check if database requires SSL/TLS
