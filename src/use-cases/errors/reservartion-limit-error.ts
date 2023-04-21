export class ReservationLimitError extends Error {
    constructor() {
        super('You have more than permited reservations.');
    }
}