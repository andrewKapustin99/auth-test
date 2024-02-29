import { BaseError } from "./base.exception.js";

class InternalServerError extends BaseError {
    constructor(message = 'Внутренняя ошибка сервера') {
      super(500, message);
    }
  }
  
class ServiceUnavailable  extends BaseError {
    constructor(message = 'сервис недоступен') {
        super(503, message);
    }
}

class TimeoutOccurred  extends BaseError {
    constructor(message = 'Время ожидания истекло') {
        super(524, message);
    }
}

export { InternalServerError, ServiceUnavailable, TimeoutOccurred }