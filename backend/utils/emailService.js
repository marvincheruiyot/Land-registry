const nodemailer = require('nodemailer');
const { logger } = require('./logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Land Registry System <noreply@landregistry.go.ke>',
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: info.messageId });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendTransferNotification(recipientEmail, recipientName, parcelNumber, transferType, status) {
    const subject = `Land Transfer ${status === 'initiated' ? 'Initiated' : status.charAt(0).toUpperCase() + status.slice(1)} - Parcel ${parcelNumber}`;
    
    const html = `
      <h2>Land Registry System - Transfer Notification</h2>
      <p>Dear ${recipientName},</p>
      <p>This is to notify you that a land transfer for parcel <strong>${parcelNumber}</strong> has been <strong>${status}</strong>.</p>
      <p><strong>Transfer Type:</strong> ${transferType}</p>
      <p>Please log in to the Land Registry System for more details.</p>
      <p>If you did not initiate this action, please contact us immediately.</p>
      <br>
      <p>Best regards,<br>Land Registry System</p>
    `;

    const text = `Dear ${recipientName}, A land transfer for parcel ${parcelNumber} has been ${status}. Transfer Type: ${transferType}. Please log in for more details.`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }

  async sendTransferApprovalEmail(recipientEmail, data) {
    const subject = `✅ Transfer Approved - Parcel ${data.parcelNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header .icon { font-size: 48px; margin-bottom: 10px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold; }
          .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">✅</div>
            <h1>Transfer Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your land transfer request has been successfully approved</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <p>Great news! Your land transfer request has been <span class="success-badge">APPROVED</span> by our Land Registry Officer.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #10b981;">📋 Transfer Details</h3>
              <div class="info-row">
                <span class="info-label">Parcel Number:</span>
                <span class="info-value">${data.parcelNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${data.location}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transfer Type:</span>
                <span class="info-value">${data.transferType}</span>
              </div>
              <div class="info-row">
                <span class="info-label">From:</span>
                <span class="info-value">${data.previousOwner} (ID: ${data.previousOwnerNationalId})</span>
              </div>
              <div class="info-row">
                <span class="info-label">To:</span>
                <span class="info-value">${data.newOwner} (ID: ${data.newOwnerNationalId})</span>
              </div>
              <div class="info-row">
                <span class="info-label">Approved By:</span>
                <span class="info-value">${data.approvedBy}</span>
              </div>
              <div class="info-row" style="border-bottom: none;">
                <span class="info-label">Approved Date:</span>
                <span class="info-value">${data.approvedDate}</span>
              </div>
            </div>
            
            <p><strong>📄 Documents Transferred:</strong> ${data.documentsTransferred} title deed document(s) have been transferred to the new owner's account.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/my-transfers" class="button">
                View Transfer Details
              </a>
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
              <strong>⚠️ Next Steps:</strong><br>
              ${data.isNewOwner ? 
                'Congratulations! You are now the registered owner. Please log in to view your new parcel and documents.' :
                'The ownership has been successfully transferred. You can view the transfer history in your account.'
              }
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Kenya Land Registry System</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>For assistance, contact: support@landregistry.go.ke | +254 700 000 000</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Transfer Approved - Parcel ${data.parcelNumber}\n\nDear ${data.recipientName},\n\nYour transfer request has been approved!\n\nParcel: ${data.parcelNumber}\nLocation: ${data.location}\nFrom: ${data.previousOwner}\nTo: ${data.newOwner}\nApproved by: ${data.approvedBy}\n\nLog in to view full details.`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }

  async sendTransferRejectionEmail(recipientEmail, data) {
    const subject = `❌ Transfer Rejected - Parcel ${data.parcelNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header .icon { font-size: 48px; margin-bottom: 10px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .info-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          .danger-badge { background: #ef4444; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold; }
          .reason-box { background: #fff7ed; border: 2px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">❌</div>
            <h1>Transfer Rejected</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your land transfer request has been declined</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <p>We regret to inform you that your land transfer request has been <span class="danger-badge">REJECTED</span> by our Land Registry Officer.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #ef4444;">📋 Transfer Details</h3>
              <div class="info-row">
                <span class="info-label">Parcel Number:</span>
                <span class="info-value">${data.parcelNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${data.location}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transfer Type:</span>
                <span class="info-value">${data.transferType}</span>
              </div>
              <div class="info-row">
                <span class="info-label">From:</span>
                <span class="info-value">${data.previousOwner} (ID: ${data.previousOwnerNationalId})</span>
              </div>
              <div class="info-row">
                <span class="info-label">To:</span>
                <span class="info-value">${data.newOwner} (ID: ${data.newOwnerNationalId})</span>
              </div>
              <div class="info-row">
                <span class="info-label">Rejected By:</span>
                <span class="info-value">${data.rejectedBy}</span>
              </div>
              <div class="info-row" style="border-bottom: none;">
                <span class="info-label">Rejected Date:</span>
                <span class="info-value">${data.rejectedDate}</span>
              </div>
            </div>
            
            <div class="reason-box">
              <h4 style="margin-top: 0; color: #f59e0b;">📝 Reason for Rejection:</h4>
              <p style="margin: 0; font-size: 16px;"><strong>${data.rejectionReason}</strong></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/help" class="button">
                Contact Support
              </a>
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 5px;">
              <strong>ℹ️ What to do next:</strong><br>
              • Review the rejection reason above<br>
              • Correct any issues or provide missing documents<br>
              • Contact our support team for clarification<br>
              • You may resubmit the transfer request after addressing the concerns
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Kenya Land Registry System</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>For assistance, contact: support@landregistry.go.ke | +254 700 000 000</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Transfer Rejected - Parcel ${data.parcelNumber}\n\nDear ${data.recipientName},\n\nYour transfer request has been rejected.\n\nParcel: ${data.parcelNumber}\nLocation: ${data.location}\nFrom: ${data.previousOwner}\nTo: ${data.newOwner}\nReason: ${data.rejectionReason}\n\nContact support for more information.`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }

  async sendVerificationEmail(recipientEmail, recipientName, verificationLink) {
    const subject = 'Verify Your Email - Land Registry System';
    
    const html = `
      <h2>Welcome to Land Registry System</h2>
      <p>Dear ${recipientName},</p>
      <p>Thank you for registering with the Land Registry System.</p>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create this account, please ignore this email.</p>
      <br>
      <p>Best regards,<br>Land Registry System</p>
    `;

    const text = `Dear ${recipientName}, Please verify your email address by visiting: ${verificationLink}`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }

  async sendPasswordResetEmail(recipientEmail, recipientName, resetLink) {
    const subject = 'Password Reset Request - Land Registry System';
    
    const html = `
      <h2>Password Reset Request</h2>
      <p>Dear ${recipientName},</p>
      <p>You have requested to reset your password for the Land Registry System.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <br>
      <p>Best regards,<br>Land Registry System</p>
    `;

    const text = `Dear ${recipientName}, Reset your password by visiting: ${resetLink}`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }

  async sendReminderEmail(recipientEmail, recipientName, message) {
    const subject = 'Reminder - Land Registry System';
    
    const html = `
      <h2>Reminder</h2>
      <p>Dear ${recipientName},</p>
      <p>${message}</p>
      <p>Please log in to the Land Registry System to take necessary action.</p>
      <br>
      <p>Best regards,<br>Land Registry System</p>
    `;

    const text = `Dear ${recipientName}, ${message}`;

    return await this.sendEmail(recipientEmail, subject, html, text);
  }
}

module.exports = new EmailService();
