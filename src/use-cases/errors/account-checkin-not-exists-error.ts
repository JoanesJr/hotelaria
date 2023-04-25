export class AccountCheckInNotExistsError extends Error {
    constructor() {
        super('The CheckIn not exists.');
    }
}