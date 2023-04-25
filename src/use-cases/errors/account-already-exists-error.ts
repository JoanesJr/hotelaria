export class AccountAlreadyExistsError extends Error {
    constructor() {
        super('Already exists account for this checkIn.');
    }
}