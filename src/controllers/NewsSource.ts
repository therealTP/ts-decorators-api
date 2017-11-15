import {
    Controller,
} from "ts-express-decorators";
import { AbstractRestController } from './AbstractRestController';
import { NewsSourceDao } from './../daos/NewsSourceDao';
import { NewsSourceResponse } from './../models/NewsSourceResponse';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';

@Controller("/sources")
// @Use(AuthenticateMW)
export class NewsSourceController extends AbstractRestController<NewsSourceDao, NewsSourceResponse, CreateNewsSourceRequest, UpdateNewsSourceRequest> {
    constructor() {
        super("News source", new NewsSourceDao());
    }
}