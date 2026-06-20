export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean
  public headers: Record<string, string>

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    this.headers = {}
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 422, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    this.errors = errors
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR')
    this.name = 'AuthError'
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
