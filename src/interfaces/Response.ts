import { UserError } from './../classes/UserError';

export interface IResponse {
    success: boolean;
    errors: UserError | UserError[] | null;
    response: any;
}