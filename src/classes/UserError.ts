/**
 * Used for surfacing error details to user or for logging
 */
export class UserError {
    code: string;
    message: string;
    status: number;

    constructor(code: string, message: string, status: number) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}