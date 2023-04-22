export class CheckInAlreadyExistsError extends Error {
    constructor() {
        super('CheckIn already exists.');
    }
}