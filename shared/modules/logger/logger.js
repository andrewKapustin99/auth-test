// import winston from "winston";
// import * as dotenv from 'dotenv';
// dotenv.config();

// const mode = process.env.MODE || 'development'
// class Logger {
//     constructor() {
//         this.logger = winston.createLogger({
//             level: 'info',
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.json()
//             ),
//             transports: this.getTransports()
//         });
//     }
//     async logError(level, error, route ) {
//         const logMessage = `${error.statusCode} - ${route}\n${error.stack}`;

//         switch (level) {
//             case 'error':
//                 this.logger.error(logMessage);
//                 break;
//             case 'warn':
//                 this.logger.warn(logMessage);
//                 break;
//             default:
//                 console.error(`Неизвестный уровень логирования: ${level}`);
//         }
//     }
//     async logInfo(info, route = 'вне маршрутизации') {
//         const logMessage = `${info.status} - ${route}\n${info.message}`;
//         if (this.env !== 'production') {
//             this.logger.info(logMessage);
//         }
//     }
//     getTransports() {
//         switch (mode) {
//             case 'development':
//                 return [
//                     new winston.transports.Console()
//                 ];
//             case 'production':
//                 return [
//                     new winston.transports.File({ filename: 'logs.txt' })
//                 ];
//             case 'test':
//                 return [
//                     new winston.transports.Console(),
//                     new winston.transports.File({ filename: 'logs.txt' })
//                 ];
//             default:
//                 console.error(`Неизвестное окружение: ${mode}`);
//                 return [];
//         }
//     }
// }

// const logger = new Logger()

// export { logger }


import winston from "winston";
import * as dotenv from 'dotenv';
dotenv.config();

const mode = process.env.MODE || 'development';

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: this.getTransports()
        });
    }

    logError(level, error, route) {
        const logMessage = `${error?.statusCode} - ${route}\n${error?.stack}`;

        switch (level) {
            case 'error':
                this.logger.error(logMessage);
                break;
            case 'warn':
                this.logger.warn(logMessage);
                break;
            default:
                console.error(`Неизвестный уровень логирования: ${level}`);
        }
    }

    logInfo(info, route = 'вне маршрутизации') {
        const logMessage = `${info?.status} - ${route}\n${info?.message}`;
        if (mode !== 'production') {
            this.logger.info(logMessage);
        }
    }

    getTransports() {
        switch (mode) {
            case 'development':
                return [
                    new winston.transports.Console()
                ];
            case 'production':
                return [
                    new winston.transports.File({ filename: 'logs.txt' })
                ];
            case 'test':
                return [
                    new winston.transports.Console(),
                    new winston.transports.File({ filename: 'logs.txt' })
                ];
            default:
                console.error(`Неизвестное окружение: ${mode}`);
                return [];
        }
    }
}

const logger = new Logger();

export { logger };
