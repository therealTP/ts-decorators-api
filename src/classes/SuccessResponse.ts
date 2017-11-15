import { IResponse } from './../interfaces/Response';

export class SuccessResponse implements IResponse {
    success: boolean;
    errors: null;
    // response: T | {results: T[]};
    response: {};

    constructor(response: {}) {
        this.success = true;
        this.errors = null;
        this.response = response;
    }
}