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

import { AbstractController } from './AbstractController';
import { NewsSourceDao } from './../daos/NewsSourceDao';
import { SuccessResponse } from './../classes/SuccessResponse';
import { NewsSourceResponse } from './../models/NewsSourceResponse';
import { ListNewsSourceRequest } from './../models/ListNewsSourceRequest';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';
import { logAndThrowUserError } from './../services/errors';

@Controller("/sources")
// @Use(AuthenticateMW)
export class NewsSourceController extends AbstractController<NewsSourceDao> {
    constructor() {
        super({
            dao: new NewsSourceDao(),
            resourceLabel: "news source"
        });
    }

    @Get("/")
    // @Authenticated()
    async getAll(@QueryParams() queryParams: ListNewsSourceRequest): Promise<SuccessResponse> {
        const sources = await this.dao.findMany(queryParams);
        return new SuccessResponse({sources});
    }

    /**
     * @returns SuccessResponse
     */
    @Get("/:id")
    async get(@Required() @PathParams("id") id: string): Promise<SuccessResponse> {
        const resource = await this.dao.findOneById(id);
        if (resource) return new SuccessResponse(resource);
        logAndThrowUserError("err.not_found", this.resourceLabel);
    }

    @Post("/")
    async post(@BodyParams() createRequest: CreateNewsSourceRequest): Promise<SuccessResponse> {
        console.log("CREATE REQUEST", createRequest);

        // const createResponse = await this.dao.create(createRequest);
        const createResponse = null;
        
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