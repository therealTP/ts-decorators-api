/**
 * Used for surfacing error details to user or for logging
 */
export class UserError {
    message: string;
    code: string;
    details: string;

    constructor(message: string, code: string, details: string) {
        this.message = message;
        this.code = code;
        this.details = details;
    }
}