/*
* Use this suite of util functions to standardize errors from all layers of application
*/
import { Request, Response, NextFunction } from 'express';
import { UserError } from './../classes/UserError';
import { ErrorResponse } from './../classes/ErrorResponse';
import { errors } from './../properties/errors';
import { logger } from './logger';

export {
    throwRequestError,
    throwAuthError,
    handleDbErrorResponse,
    handleDbConnectionError
}

/**
* Generic function to generate error response, log, + throw
*
*/
const logAndThrowError = (code: string, status: number, details?: string): void => {
    const generalErrCode = "err.general_error";
    if (!code) code = generalErrCode;
    
    // look up code's error message, override w/ details if provided:
    const message = (details || errors[code] || errors[generalErrCode]);

    // create user error from message + code:
    const error = new UserError(code, message, status);

    // log error
    logger.log(error);

    // throw error response
    throw error;
};

const throwRequestError = (code: string) => {
    logAndThrowError(code, 400);
};

/**
 * --- AUTH ERROR FUNCTIONS ---
 */
const throwAuthError = (): void => {
    logAndThrowError("err.unauthorized", 403);
};

/*
* --- DATABASE ERROR FUNCTIONS ---
*/
let handleDbErrorResponse = (err: any): void => {
    const details = parseDatabaseError(err.message);
    logAndThrowError("err.database_query_error", 500, details);
};

let handleDbConnectionError = (err: any): void => {
    const details = parseDatabaseError(err.message);
    // look up code's error message, if it exists:
    logAndThrowError("err.database_connect_error", 500, details);
};

const parseDatabaseError = (message: string) => {
    return message.replace(/\"/g, "'").replace(/""/g, '"');
};