// Errors with a message that is safe to show to users. Anything else is
// logged on the server and replaced with a generic message.
export class UserFacingError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "UserFacingError";
  }
}
