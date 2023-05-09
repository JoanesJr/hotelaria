export class AccountNotExistsError extends Error {
    constructor() {
        super('This account not exists.');
    }
}