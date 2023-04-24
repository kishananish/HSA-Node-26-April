import winston from 'winston';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';

const dir = './log';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const logger = winston.createLogger({
	transports: [

		new winston.transports.Console(),

		new DailyRotateFile({
			level: 'error',
			filename: dir + '/error_',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		}),
		new DailyRotateFile({
			level: 'info',
			filename: dir + '/info_',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		})
	]
});

export default logger;

