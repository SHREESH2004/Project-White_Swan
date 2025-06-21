import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, colorize, errors } = format;

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const customFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

export const logger = createLogger({
  level: isProduction ? 'info' : 'debug', 
  format: combine(
    label({ label: 'Flight Booking' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), 
    customFormat
  ),
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

if (!isProduction) {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        customFormat
      ),
    })
  );
}
