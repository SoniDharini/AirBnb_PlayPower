export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

export function badRequest(message) {
  return new HttpError(400, message);
}

export function notFound(message) {
  return new HttpError(404, message);
}

export function conflict(message) {
  return new HttpError(409, message);
}
