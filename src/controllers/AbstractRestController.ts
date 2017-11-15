import {
    Authenticated,
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    Required,
    Status,
    Use
} from "ts-express-decorators";
import { NotFound } from "ts-httpexceptions";
import { v4 as uuid } from 'uuid';
import { CustomTokenMiddleware } from "../middlewares/CustomTokenMiddleware";
import { Dao } from './../daos/Dao';
import { AbstractCreateRequest } from './../classes/AbstractCreateRequest';
import { SuccessResponse } from './../classes/SuccessResponse';
import { logAndThrowUserError } from './../services/errors';
import { UserError } from './../classes/UserError';

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * @Controller("/calendars", EventCtrl)
 * In this case, EventCtrl is a dependency of CalendarCtrl.
 * All routes of EventCtrl will be mounted on the `/calendars` path.
 */

export class AbstractRestController<DaoType extends Dao<ResourceResponseType, CreateRequestType, UpdateRequestType>, ResourceResponseType, CreateRequestType extends AbstractCreateRequest, UpdateRequestType> {
    private resourceName: string;
    private dao: DaoType;

    constructor(resourceName: string, dao: DaoType) {
        this.resourceName = resourceName;
        this.dao = dao;
    }

    @Get("/")
    // @Authenticated()
    async getAll(): Promise<SuccessResponse> {
        // let listRequest = new ListNewsSourceRequest(req.query.limit, req.query.offset, req.query.sort);
        // let searchTerm: string = req.query.q;

        // // Filter params: not search term or query options
        // let filterParams = lo.omit(req.query, ['q', 'limit', 'offset', 'order_by']);
        
        // this.dao.findMany(listRequest, searchTerm, filterParams)
        // .then(data => {
        //     let listResponse = new ListNewsSourceResponse(data);
        //     res.json(listResponse);
        // })
        // .catch(err => {
        //     handleDbErrorResponse(err, res);
        // });
        return new SuccessResponse({});
    }

    /**
     * Example of customised call. You can use decorators to inject express object like `response` as `@Response`,
     * `request` as `@Request` and `next` as `@Next`.
     *
     * Another decorator are available to access quickly to the pathParams request. `@PathParams` take an expression in
     * first parameter.
     * @returns {{id: any, name: string}}
     */

    @Get("/:id")
    async get(@Required() @PathParams("id") id: string): Promise<SuccessResponse> {
        const resourceResponse = await this.dao.findOneById(id);

        if (resourceResponse) return new SuccessResponse(resourceResponse);

        logAndThrowUserError("err.not_found", this.resourceName);
    }

    @Post("/")
    async post(@BodyParams() createRequest: CreateRequestType): Promise<SuccessResponse> {
        // Generate UUID here ONLY!
        createRequest.id = uuid();

        console.log("CREATE REQUEST", createRequest);

        const createResponse = await this.dao.create(createRequest);
        
        if (createResponse) return new SuccessResponse(createResponse);
        logAndThrowUserError("err.create_failed", this.resourceName);
        // this.dao.create(createRequest)
        // .then(data => {
        //     let createResponse = new CreateNewsSourceResponse(data);
        //     res.json(createResponse);
        // })
        // .catch(err => {
        //     handleDbErrorResponse(err, res);
        // });
        // return Promise.resolve("success!");

        // throw new NotFound("Calendar not found");
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
