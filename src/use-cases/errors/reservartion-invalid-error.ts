export class ReservationInvalidError extends Error {
    constructor() {
        super('The entry date must be greater than the exit date.');
    }
}