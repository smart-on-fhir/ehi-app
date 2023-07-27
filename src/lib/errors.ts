export class UnauthorizedError extends Error {
  // NOTE: Happy to take feedback on this object
  code = 401;
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
