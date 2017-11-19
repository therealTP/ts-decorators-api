/*
* Use this suite of util functions to standardize errors from all layers of application
*
*/
import { Request, Response, NextFunction } from 'express';
import { UserError } from './../classes/UserError';
import { ErrorResponse } from './../classes/ErrorResponse';
import { errors } from './../properties/errors';
import { logger } from './logger';

/**
* Generic function to generate error response, log, + respond
*
*/
const generateError = (code: string, status: number, detail?: string): UserError => {
    const generalErrCode = "err.general_error";
    if (!code) code = generalErrCode;
    
    // look up code's error message:
    const message = (detail || errors[code] || errors[generalErrCode]);

    // create user error from message + code:
    const error = new UserError(code, message, status);

    return error;
};

const logAndThrowUserError = (code: string, status: number, details?: string): void => {
    const error = generateError(code, status, details);

    // log error
    logger.log(error);

    // throw error response
    throw error;
};

const throwRequestError = (code: string) => {
    logAndThrowUserError(code, 400);
};

/**
 * --- AUTH ERROR FUNCTIONS ---
 */
const throwAuthError = (): void => {
    logAndThrowUserError("err.unauthorized", 403);
};

/*
* --- DATABASE ERROR FUNCTIONS ---
*/
let handleDbErrorResponse = (err: any): void => {
    const details = parseDatabaseError(err.message);
    logAndThrowUserError("err.database_query_error", 500, details);
};

let handleDbConnectionError = (err: any): void => {
    const details = parseDatabaseError(err.message);
    // look up code's error message, if it exists:
    logAndThrowUserError("err.database_connect_error", 500, details);
};

const parseDatabaseError = (message: string) => {
    return message.replace(/\"/g, "'").replace(/""/g, '"');
};

export {
    logAndThrowUserError,
    throwRequestError,
    throwAuthError,
    handleDbErrorResponse,
    handleDbConnectionError
}