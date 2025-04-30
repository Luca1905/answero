export class AuthenticationError extends Error {
  public readonly code: string;

  constructor(message = "User is not authenticated.") {
    super(message);

    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.name = "AuthenticationError";
    this.code = "UNAUTHENTICATED";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}

export class AuthorizationError extends Error {
  public readonly code: string;

  constructor(message = "User is not authenticated.") {
    super(message);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
    this.name = "AuthorizationError";
    this.code = "UNAUTHORIZED";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
  }
}

export class NotFoundError extends Error {
  public readonly code: string;

  constructor(message = "Ressource not found") {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = "NotFoundError";
    this.code = "NOTFOUNDERROR";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export type BackendError =
  | AuthenticationError
  | AuthorizationError
  | NotFoundError;
