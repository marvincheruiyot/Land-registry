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
