export class ReservationLimitError extends Error {
    constructor() {
        super('Reservation with a number of days greater than allowed.');
    }
}