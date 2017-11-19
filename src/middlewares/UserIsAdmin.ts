import { HeaderParams, IMiddleware, Middleware, Request } from "ts-express-decorators";
import { Request as ExpressRequest} from 'express';
import { throwAuthError } from './../services/errors';
import { ITokenData } from './../interfaces/TokenData';

@Middleware()
export class UserIsAdmin implements IMiddleware {
    /**
     * Will only reach this middleware if already authed
     * @param auth
     * @param request
     */
    use(@Request() request: ExpressRequest) {
        const userData : ITokenData = (<any>request).user;
        const adminTypes = ['ADMIN', 'MASTER'];

        if (!adminTypes.includes(userData.userType)) throwAuthError();
    };
}