import winston from 'winston';

export class BaseError extends Error {
    constructor(statusCode, message) {
      super(message);
  
      Object.setPrototypeOf(this, new.target.prototype);
      this.statusCode = statusCode;
      Error.captureStackTrace(this);
    }
    
    toResponse() {
        return {
            status: this.statusCode,
            message: this.message
        };
    }
}