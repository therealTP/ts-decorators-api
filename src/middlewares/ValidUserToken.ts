import { HeaderParams, IMiddleware, Middleware, Request } from "ts-express-decorators";
import { Unauthorized } from "ts-httpexceptions";
import { verifyToken } from './../services/auth';
import { throwAuthError } from './../services/errors';
import { Request as ExpressRequest} from 'express';

@Middleware()
export class ValidUserToken implements IMiddleware {
    /**
     * Checks user token. If valid, attached data to req.user
     * If not valid, throws auth exception
     * @param auth
     * @param request
     */
    use(@HeaderParams("Authorization") authHeader: string, @Request() request: ExpressRequest) {
        try {
            const headerToken = authHeader.replace("Bearer ", "");
            const userData = verifyToken(headerToken);
            (<any>request).user = userData; 
        } catch(e) {
            throwAuthError();
        }
    };
}