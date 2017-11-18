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
    Use
} from "ts-express-decorators";
import { Format } from "ts-express-decorators/ajv";
import { AbstractController } from './AbstractController';
import { UserDao } from './../database/UserDao';
import { SuccessResponse } from './../classes/SuccessResponse';
import { UserResponse } from './../models/UserResponse';
import { ListNewsSourceRequest } from './../models/ListNewsSourceRequest';
import { CreateUserRequest } from './../models/CreateUserRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';
import { logAndThrowUserError } from './../services/errors';

@Controller("/user")
// @Use(AuthenticateMW)
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
    // @Authenticated()
    async getAll(@QueryParams() queryParams: ListNewsSourceRequest): Promise<SuccessResponse> {
        const sources = await this.dao.findMany(queryParams);
        return new SuccessResponse({sources});
    }

    /**
     * @param id: uuid
     * @returns {Promise<SuccessResponse>}
     */
    @Get("/:id")
    async get(@Required() @Format('uuid') @PathParams("id") id: string): Promise<SuccessResponse> {
        const resource = await this.dao.findOneById(id);
        if (resource) return new SuccessResponse(resource);

        // explicitly throw error if nothing found for that id
        logAndThrowUserError("err.resource_not_found", this.resourceLabel);
    }

    @Post("/")
    async post(@BodyParams() createRequest: CreateUserRequest): Promise<SuccessResponse> {
        console.log("CREATE REQUEST", createRequest);

        const createResponse = await this.dao.create(createRequest);
        
        if (createResponse) return new SuccessResponse(createResponse);

        logAndThrowUserError("err.create_failed", this.resourceLabel);
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