export class ParametersAlreadyExistsError extends Error {
    constructor() {
        super('Parameters already exists.');
    }
}