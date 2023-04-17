export class DataNotFoundError extends Error {
    constructor() {
        super('This id not exists');
    }
}