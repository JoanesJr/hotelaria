export class ItemAlreadyExistsError extends Error {
    constructor() {
        super('Item already exists.');
    }
}