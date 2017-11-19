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
    Required,
    Status,
    Use,
    UseBefore,
    UseAfter
} from "ts-express-decorators";
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

@Controller("/user")
export class UserController extends AbstractController<UserDao> {
    constructor() {
        super({
            dao: new UserDao(),
            resourceLabel: "user"
        });
    }

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
    @Get("/:id")
    @UseBefore(ValidUserToken)
    @Use(UserIsAdmin)
    @UseAfter(RemoveResponsePasswordMw)
    async get(@Required() @Format('uuid') @PathParams("id") id: string): Promise<SuccessResponse> {
        // Make sure user ID in session/token matches id requesting
        // OR is admin/master
        const user = await this.dao.findOneById(id);
        if (user) return new SuccessResponse(user);

        // explicitly throw error if nothing found for that id
        throwRequestError("err.user_not_found");
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

    // /**
    //  * Your method can return a Promise to respond to a request.
    //  *
    //  * By default, the response is sent with status 200 and is serialized in JSON.
    //  *
    //  * @param id
    //  * @returns {Promise<Calendar>}
    //  */
    // @Get("/status/:id")
    // @Status(202)
    // async changeStatus(@PathParams("id") id: string): Promise<Calendar> {
    //     const calendar = this.calendars.find(calendar => calendar.id === id);

    //     if (calendar) {
    //         return Promise.resolve(calendar);
    //     }

    //     throw new NotFound("Calendar not found");
    // }

    // /**
    //  * You can append a middleware to your route with `@Use`. Your middleware will be called before the method `getWithMiddleware`.
    //  * @returns {{user: (number|any|string)}}
    //  */
    // @Get("/middleware")
    // @Use(CustomTokenMiddleware)
    // async getWithMiddleware(@PathParams("id") id: string): Promise<Calendar> {

    //     const calendar = this.calendars.find(calendar => calendar.id === id);

    //     if (calendar) {
    //         return Promise.resolve(calendar);
    //     }

    //     throw new NotFound("Calendar not found");
    // }

    // /**
    //  *
    //  * @param id
    //  * @param name
    //  * @returns {Promise<Calendar>}
    //  */
    // @Post("/:id")
    // async update(@PathParams("id") @Required() id: string,
    //              @BodyParams("name") @Required() name: string): Promise<Calendar> {
    //     const calendar = await this.get(id);
    //     calendar.name = name;
    //     return calendar;
    // }

    // /**
    //  *
    //  * @param id
    //  * @returns {{id: string, name: string}}
    //  */
    // @Delete("/")
    // // @Authenticated()
    // @Status(204)
    // async remove(@BodyParams("id") @Required() id: string): Promise<any> {
    //     this.calendars = this.calendars.filter(calendar => calendar.id === id);
    // }
}