import { logger } from "../logger/logger.js";
import { BaseError } from "./base.exception.js";
import { InternalServerError } from "./server.exception.js";

export async function generateError(error, route = 'вне маршрутизации') {
    if (error instanceof BaseError) {
        await loggingError(error, route)
        return error.toResponse();
    }
    const defaultError = new InternalServerError(error.message);
    await loggingError(defaultError, route)

    return defaultError.toResponse()
}

async function loggingError(error, route) {
    if (error.statusCode && error.statusCode.toString().startsWith('4')) {
        await logger.logError('warn', error, route);
    } else {
        await logger.logError('error', error, route);
    }
}