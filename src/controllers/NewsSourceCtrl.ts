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
    UseBefore
} from "ts-express-decorators";
import { Format } from "ts-express-decorators/ajv";
import { AbstractController } from './AbstractController';
import { NewsSourceDao } from './../database/NewsSourceDao';
import { SuccessResponse } from './../classes/SuccessResponse';
import { NewsSourceResponse } from './../models/NewsSourceResponse';
import { ListNewsSourceRequest } from './../models/ListNewsSourceRequest';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';
import { ValidUserToken } from './../middlewares/ValidUserToken';
import { UserIsAdmin } from './../middlewares/UserIsAdmin';
import { throwRequestError } from './../services/errors';

// TODO:
// get news source popularity stats
// get news source tweets
// get news source RSS stories
// get news source associated people
// delete/deactivate news source (ADMIN)

@Controller("/sources")
// @Use(AuthenticateMW)
export class NewsSourceController extends AbstractController<NewsSourceDao> {
    constructor() {
        super(new NewsSourceDao());
    }

    /**
     * @param queryParams: ListNewsSourceRequest
     * @returns {Promise<SuccessResponse>}
     */
    @Get("/")
    // @Authenticated()
    async getMany(@QueryParams() queryParams: ListNewsSourceRequest): Promise<SuccessResponse> {
        const sources = await this.dao.findMany(queryParams);
        return new SuccessResponse({sources});
    }

    /**
     * @param id: uuid
     * @returns {Promise<SuccessResponse>}
     */
    @Get("/:id/details")
    // @UseBefore(ValidApiToken)
    async getOneById(@Required() @Format('uuid') @PathParams("id") id: string): Promise<SuccessResponse> {
        const resource = await this.dao.findOneById(id);
        if (resource) return new SuccessResponse(resource);

        // explicitly throw error if nothing found for that id
        throwRequestError("err.news_source_not_found");
    }

    // =============================================================
    // ADMIN ROUTES
    // =============================================================
    
    @Post("/")
    @UseBefore(ValidUserToken)
    @UseBefore(UserIsAdmin)
    async create(@BodyParams() createRequest: CreateNewsSourceRequest): Promise<SuccessResponse> {
        const createResponse = await this.dao.create(createRequest);
        if (createResponse) return new SuccessResponse(createResponse);

        throwRequestError("err.create_news_source");
    }

    /**
     * @param id: uuid
     * @returns {Promise<SuccessResponse>}
     */
    @Put("/:id")
    @UseBefore(ValidUserToken)
    @UseBefore(UserIsAdmin)
    async update(
        @Required() @Format('uuid') @PathParams("id") id: string,
        @BodyParams() updateRequest: UpdateNewsSourceRequest): 
        Promise<SuccessResponse> {
        const updateResponse = await this.dao.update(id, updateRequest);
        if (updateResponse) return new SuccessResponse(updateResponse);

        throwRequestError("err.update_news_source");
    }
}