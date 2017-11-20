import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    QueryParams,
    Put,
    Request,
    Required,
    Status,
    Use,
    UseBefore,
    UseAfter
} from "ts-express-decorators";
import { Request as ExpressRequest } from 'express';
import { Format } from "ts-express-decorators/ajv";
import { AbstractController } from './AbstractController';
import { UserDao } from './../database/UserDao';
import { hashPassword, comparePasswordWithHash, generateToken } from './../services/auth';
import { SuccessResponse } from './../classes/SuccessResponse';
import { UserResponse } from './../models/UserResponse';
import { ListUserRequest } from './../models/ListUserRequest';
import { RegisterUserRequest } from './../models/RegisterUserRequest';
import { LoginUserRequest } from './../models/LoginUserRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';
import { throwRequestError } from './../services/errors';
import { RemoveResponsePasswordMw } from './../middlewares/RemoveResponsePassword';
import { ValidUserToken } from './../middlewares/ValidUserToken';
import { UserIsAdmin } from './../middlewares/UserIsAdmin';

// TODO:
// post user follow of news source (only own user can do this)
// register/login with facebook / google
// update user (only own user or admin (?) can do this)
// deactivate user (only own user can do this)

@Controller("/users")
export class UserController extends AbstractController<UserDao> {
    constructor() {
        super(new UserDao());
    }

    /**
     * Only newly registering users can create user accounts
     * @param createRequest
     */
    @Post("/register")
    // @UseBefore(IsNotAuthed)
    @UseAfter(RemoveResponsePasswordMw)
    async register(@BodyParams() registerRequest: RegisterUserRequest): Promise<SuccessResponse> {
        // check if user already exists:
        const user = await this.dao.findOneByAltId(registerRequest.email);
        if (user) throwRequestError("err.user_exists");
        
        // SALT pw before storing
        registerRequest.password = await hashPassword(registerRequest.password);
        const registerResponse = await this.dao.create(registerRequest);
        
        // Login at same time of registration?
        if (registerResponse) return new SuccessResponse(registerResponse);

        throwRequestError("err.user_registration_failed");
    }

    @Post("/login")
    // @UseBefore(IsNotAuthed)
    async login(@BodyParams() loginRequest: LoginUserRequest): Promise<SuccessResponse> {
        // check if user exists:\
        const user = await this.dao.findOneByAltId(loginRequest.email);
        if (!user) throwRequestError("err.user_login_failed");
        
        // compare request pw with stored pw hash:
        const match = await comparePasswordWithHash(loginRequest.password, user.password);
        
        // if match, return success response & attach token
        if (match) {
            const token = generateToken(user);
            return new SuccessResponse({token});
        }

        throwRequestError("err.user_login_failed");
    }

    @Get("/auth")
    @UseBefore(ValidUserToken)
    @UseAfter(RemoveResponsePasswordMw)
    async getCurrentUserAuth(@Request() request: ExpressRequest) {
        // at this point, user data is included as req.user
        const user = await this.dao.findOneById((<any>request).user.id);
        if (user) return new SuccessResponse(user);

        // explicitly throw error if nothing found for current user id (shouldn't happen)
        throwRequestError("err.user_not_found");
    }

    // =============================================================
    // ADMIN ROUTES
    // =============================================================

    /**
     * @param queryParams: ListNewsSourceRequest
     * @returns {Promise<SuccessResponse>}
     */
    @Get("/")
    @UseBefore(ValidUserToken)
    @UseBefore(UserIsAdmin)
    @UseAfter(RemoveResponsePasswordMw)
    async getAll(@QueryParams() queryParams: ListUserRequest): Promise<SuccessResponse> {
        const sources = await this.dao.findMany(queryParams);
        return new SuccessResponse({sources});
    }

    /**
     * @param id: uuid
     * @returns {Promise<SuccessResponse>}
     */
    @Get("/:id/details")
    @UseBefore(ValidUserToken)
    @Use(UserIsAdmin)
    @UseAfter(RemoveResponsePasswordMw)
    async getUserDetails(@Required() @Format('uuid') @PathParams("id") id: string): Promise<SuccessResponse> {
        // Make sure user ID in session/token matches id requesting
        // OR is admin/master
        const user = await this.dao.findOneById(id);
        if (user) return new SuccessResponse(user);

        // explicitly throw error if nothing found for that id
        throwRequestError("err.user_not_found");
    }
}