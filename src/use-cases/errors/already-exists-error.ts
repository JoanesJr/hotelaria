export class AlreadyExistsError extends Error {
    constructor(obj: string) {
        super(`${obj.toLocaleUpperCase()} already exists.`);
    }
}