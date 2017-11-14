import { IResponse } from './../interfaces/Response';

export class SuccessResponse<T> implements IResponse {
    success: boolean;
    errors: null;
    response: T | {results: T[]};

    constructor(response: T | {results: T[]}) {
        this.success = true;
        this.errors = null;
        this.response = response;
    }
}