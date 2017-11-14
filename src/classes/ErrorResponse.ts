import { IResponse } from './../interfaces/Response';
import { UserError } from './UserError';

export class ErrorResponse implements IResponse {
    success: boolean;
    errors: UserError | UserError[];
    response: null;

    constructor(errors: UserError | UserError[]) {
        this.success = false;
        this.errors = errors;
        this.response = null;
    }
}