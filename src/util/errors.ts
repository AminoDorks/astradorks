export class AstraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AstraError';
  }
}
