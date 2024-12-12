export class NotExistsError extends Error {
    constructor(entity: string) {
        super(`${entity.toLocaleUpperCase()} not exists.`);
    }
}