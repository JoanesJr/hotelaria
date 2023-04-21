export class RoomNotIsAvailablesError extends Error {
    constructor() {
        super('Room not is available.');
    }
}