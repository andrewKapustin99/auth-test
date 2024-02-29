import { BaseError } from "./base.exception.js";

class BadRequestException extends BaseError {
    constructor(message = 'Некорректный запрос') {
      super(400, message);
    }
  }
  
class UnauthorizedException extends BaseError {
    constructor(message = 'Не авторизирован') {
        super(401, message);
    }
}

class Forbidden extends BaseError {
    constructor(message = 'Нет доступа') {
        super(403, message);
    }
}

class NotFound extends BaseError {
    constructor(message = 'Не найдено') {
        super(404, message);
    }
}

export {BadRequestException, UnauthorizedException, Forbidden, NotFound}