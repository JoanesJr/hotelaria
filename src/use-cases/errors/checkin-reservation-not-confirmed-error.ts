export class CheckInReservationNotConfirmedError extends Error {
    constructor() {
        super('This reservation is not confirmed.');
    }
}