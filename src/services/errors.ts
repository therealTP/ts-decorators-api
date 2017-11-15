/*
* Use this suite of util functions to standardize errors from all layers of application
*
*/
import { Request, Response, NextFunction } from 'express';
import { UserError } from './../classes/UserError';
import { ErrorResponse } from './../classes/ErrorResponse';
import { errors } from './../properties/errors';
import { logger } from './logger';

/*
* Generic function to generate error response, log, + respond
*
*/
const generateError = (code: string, resource: string): UserError => {
    const generalErrCode = "err.general_error";
    if (!code) code = generalErrCode;
    // look up code's error message, if it exists:
    const message = (errors[code] || errors[generalErrCode]);
    // TODO: add resource name to detail message associated w/ code
    const detail = resource;

    // create user error from message + code:
    const error = new UserError(message, code, detail);

    return error;
};

export const logAndThrowUserError = (code: string, details: string): void => {
    const error = generateError(code, details);

    // log error
    logger.log(error);
    
    // ERROR!
    console.log("ERROR");

    // throw error response
    throw error;

    // send error response w/ default 500 status code (if no status)
    // res.status((status || 500)).json(errorResponse);
};

/*
* --- DATABASE ERROR FUNCTIONS ---
*/
export let handleDbErrorResponse = (err: any, res: Response): void => {
    const details = parseDatabaseError(err.message);
    logAndThrowUserError("err.database_query_error", details);
};

export let handleDbConnectionError = (err: any): void => {
    const details = parseDatabaseError(err.message);
    // look up code's error message, if it exists:
    logAndThrowUserError("err.database_connect_error", details);
};

const parseDatabaseError = (message: string) => {
    return message.replace(/\"/g, "'").replace(/""/g, '"');
};

/*
* --- VALIDATION ERROR FUNCTIONS ---
*/
export let handleValidationErrorMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = [];

    if (!errors.length) {
        // TODO: create details array w/ this:x
        // const details = errors.map(mapValidationErrorToString);
        const details = 'db error!';
        logAndThrowUserError("err.invalid_request", details);
    } else {
        next();
    }
};

// const mapValidationErrorToString = (error: MappedError) => {
//     return `${error.msg} '${error.value}' in ${error.location}`;
// };