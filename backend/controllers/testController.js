const emailService = require('../utils/emailService');

// Test email endpoint
exports.testEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || 'marvinbett10@gmail.com';

    console.log('🧪 Testing email configuration...');
    console.log('Test email address:', testEmail);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD configured:', !!process.env.EMAIL_PASSWORD);

    // Send test email
    const result = await emailService.sendEmail(
      testEmail,
      '🧪 Test Email - Kenya Land Registry',
      `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Email Test</h1>
              <p>Kenya Land Registry System</p>
            </div>
            <div class="content">
              <h2>Email Configuration Test</h2>
              <p>If you're reading this, email configuration is working correctly!</p>
              
              <div class="success">
                <strong>✅ Success!</strong><br>
                Your email system is properly configured and ready to send notifications.
              </div>
              
              <h3>Test Details:</h3>
              <ul>
                <li><strong>Sent to:</strong> ${testEmail}</li>
                <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>From:</strong> ${process.env.EMAIL_FROM}</li>
                <li><strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}</li>
              </ul>
              
              <p style="margin-top: 20px; padding: 15px; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 5px;">
                <strong>ℹ️ Next Steps:</strong><br>
                Now that email is working, land transfer approvals and rejections will automatically send beautiful HTML emails to both parties.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      `Email Test - If you're reading this, your email configuration is working! Sent at: ${new Date().toLocaleString()}`
    );

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
      
      res.status(200).json({
        status: 'success',
        message: `Test email sent successfully to ${testEmail}. Check your inbox!`,
        data: {
          messageId: result.messageId,
          recipient: testEmail,
          sentAt: new Date().toISOString()
        }
      });
    } else {
      console.error('❌ Failed to send test email:', result.error);
      
      res.status(500).json({
        status: 'error',
        message: 'Failed to send test email',
        error: result.error,
        troubleshooting: {
          checkEmailPassword: 'Make sure EMAIL_PASSWORD in .env is set to your Gmail App Password',
          checkGmailSettings: 'Enable 2-Step Verification and generate App Password at: https://myaccount.google.com/apppasswords',
          checkEmailUser: 'Verify EMAIL_USER in .env matches your Gmail address'
        }
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Email test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get email configuration status
exports.getEmailStatus = async (req, res) => {
  try {
    const config = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
      passwordConfigured: !!process.env.EMAIL_PASSWORD,
      frontendUrl: process.env.FRONTEND_URL
    };

    const status = {
      configured: !!(config.host && config.port && config.user && config.passwordConfigured),
      config: config
    };

    if (!status.configured) {
      status.warnings = [];
      if (!config.host) status.warnings.push('EMAIL_HOST not set in .env');
      if (!config.port) status.warnings.push('EMAIL_PORT not set in .env');
      if (!config.user) status.warnings.push('EMAIL_USER not set in .env');
      if (!config.passwordConfigured) status.warnings.push('EMAIL_PASSWORD not set in .env');
    }

    res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
