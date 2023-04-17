export class TypeRoomAlreadyExistsError extends Error {
    constructor() {
        super('This TypeRoom already exists.');
    }
}