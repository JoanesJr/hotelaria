export class MajorityError extends Error {
    constructor() {
        super('You must be more 18 years of age to register.');
    }
}