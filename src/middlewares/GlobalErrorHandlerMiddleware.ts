import { NextFunction as ExpressNext, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { IMiddlewareError, MiddlewareError, Request, Response, Next, Err } from "ts-express-decorators";
import { Exception } from "ts-httpexceptions";
import { UserError } from '../classes/UserError';
import { ErrorResponse } from '../classes/ErrorResponse';
import { $log } from "ts-log-debug";

@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        @Next() next: ExpressNext
    ): any {

        if (response.headersSent) {
            return next(error);
        }

        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message + "TEST"));
            return next();
        }

        if (error instanceof UserError) {
            $log.error("" + error);
            const responseBody = new ErrorResponse(error);
            response.status(404).json(responseBody);
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
    }
}