export class RoomAlreadyExistsError extends Error {
    constructor() {
        super('Room already exists.');
    }
}