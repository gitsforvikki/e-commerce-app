export class AppError extends Error {
  code?: string;
  field?: string;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.code = code;
    this.field = field;
  }
}

export class AuthError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, "AUTH_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", field);
  }
}
