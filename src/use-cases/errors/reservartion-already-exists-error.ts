export class ReservationAlreadyExistsError extends Error {
    constructor() {
        super('This room is already booked on this date.');
    }
}