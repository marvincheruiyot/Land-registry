const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}\n`;
  }

  writeToFile(file, message) {
    fs.appendFileSync(file, message, 'utf8');
  }

  info(message, metadata = {}) {
    const formattedMessage = this.formatMessage('info', message, metadata);
    console.log(formattedMessage.trim());
    this.writeToFile(this.logFile, formattedMessage);
  }

  warn(message, metadata = {}) {
    const formattedMessage = this.formatMessage('warn', message, metadata);
    console.warn(formattedMessage.trim());
    this.writeToFile(this.logFile, formattedMessage);
  }

  error(message, metadata = {}) {
    const formattedMessage = this.formatMessage('error', message, metadata);
    console.error(formattedMessage.trim());
    this.writeToFile(this.logFile, formattedMessage);
    this.writeToFile(this.errorFile, formattedMessage);
  }

  debug(message, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, metadata);
      console.debug(formattedMessage.trim());
      this.writeToFile(this.logFile, formattedMessage);
    }
  }
}

const logger = new Logger();

module.exports = { logger };
