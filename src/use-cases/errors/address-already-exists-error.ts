export class AddressAlreadyExistsError extends Error {
    constructor() {
        super('User already address register.');
    }
}