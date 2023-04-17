export class CpfIsInvalidError extends Error {
    constructor() {
        super('The cpf needs have 11 digits.');
    }
}