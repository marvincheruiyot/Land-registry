# Email Setup Guide for Land Registry System

The system sends emails for:
- Email verification
- Password reset
- Transfer notifications
- System reminders

## Quick Setup Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Step Verification**
   - Go to [Google Account](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Enable if not already enabled

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (the 16-character password)
   EMAIL_FROM=Land Registry System <noreply@landregistry.go.ke>
   ```

4. **Restart the backend server**
   ```bash
   cd backend
   npm start
   ```

### Option 2: Mailtrap (Best for Testing)

Perfect for development - catches all emails without sending to real addresses.

1. **Sign up at [Mailtrap.io](https://mailtrap.io/)** (Free)

2. **Get credentials from Mailtrap dashboard**
   - Navigate to Email Testing → Inboxes → My Inbox
   - Copy SMTP credentials

3. **Update .env file**
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=587
   EMAIL_USER=your_mailtrap_username
   EMAIL_PASSWORD=your_mailtrap_password
   EMAIL_FROM=Land Registry System <noreply@landregistry.go.ke>
   ```

### Option 3: SendGrid (Production Ready)

1. **Sign up at [SendGrid](https://sendgrid.com/)** (Free tier: 100 emails/day)

2. **Create API Key**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Update .env file**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   EMAIL_FROM=Land Registry System <noreply@landregistry.go.ke>
   ```

## Testing Email Functionality

### Test Forgot Password Email

1. Navigate to `http://localhost:3000/forgot-password`
2. Enter a registered email address
3. Click "Send Reset Link"
4. Check your inbox (or Mailtrap inbox)

### Test Registration Email

1. Navigate to `http://localhost:3000/register`
2. Complete the registration form
3. Submit
4. Check for verification email

## Troubleshooting

### Email not sending?

1. **Check backend logs**
   ```bash
   # Look for email-related errors
   tail -f backend/logs/app-*.log
   ```

2. **Verify credentials**
   - Make sure EMAIL_USER and EMAIL_PASSWORD are correct
   - For Gmail, ensure you're using App Password, not account password

3. **Check firewall/antivirus**
   - Some firewalls block SMTP ports (587, 465)
   - Temporarily disable to test

4. **Test SMTP connection**
   Create a test file `test-email.js`:
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your_email@gmail.com',
       pass: 'your_app_password'
     }
   });
   
   transporter.sendMail({
     from: 'noreply@landregistry.go.ke',
     to: 'your_email@gmail.com',
     subject: 'Test Email',
     text: 'If you receive this, SMTP is working!'
   }, (error, info) => {
     if (error) {
       console.log('Error:', error);
     } else {
       console.log('Success:', info.messageId);
     }
   });
   ```
   
   Run: `node test-email.js`

### Gmail "Less secure app access" error?

- Gmail no longer supports "less secure apps"
- You MUST use App Passwords (see Option 1 above)
- Regular account password will not work

### Emails going to spam?

- This is common with development SMTP
- Check spam/junk folder
- For production, use proper domain and SPF/DKIM records

## Email Templates

The system includes these email templates:

1. **Password Reset** (`sendPasswordResetEmail`)
   - Subject: "Password Reset Request - Land Registry System"
   - Contains reset link valid for 1 hour

2. **Email Verification** (`sendVerificationEmail`)
   - Subject: "Verify Your Email - Land Registry System"
   - Contains verification link valid for 24 hours

3. **Transfer Notification** (`sendTransferNotification`)
   - Subject: "Land Transfer [Status] - Parcel [Number]"
   - Notifies users about transfer status changes

## Production Recommendations

For production deployment:

1. **Use a transactional email service**
   - SendGrid (99.9% deliverability)
   - Amazon SES (cost-effective)
   - Mailgun (developer-friendly)

2. **Set up proper domain authentication**
   - SPF records
   - DKIM signatures
   - DMARC policy

3. **Monitor email delivery**
   - Track bounce rates
   - Monitor spam complaints
   - Set up alerts for failed sends

4. **Use environment-specific configs**
   - Different SMTP for dev/staging/production
   - Never commit real credentials to git

## Security Best Practices

- ✅ Never commit `.env` file with real credentials
- ✅ Use App Passwords instead of account passwords
- ✅ Rotate credentials regularly
- ✅ Use different credentials for each environment
- ✅ Monitor for suspicious email activity
- ✅ Implement rate limiting on email endpoints

## Need Help?

- Check backend logs: `backend/logs/app-*.log`
- Check error logs: `backend/logs/error-*.log`
- Test SMTP connection manually
- Verify `.env` file configuration
