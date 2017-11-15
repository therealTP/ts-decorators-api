// Import db object for use w/ extra custom methods
import { db } from './../services/db';
import { DaoConfigInterface } from './DaoConfigInterface';
import { Dao } from './Dao';
import { NewsSourceResponse } from './../models/NewsSourceResponse';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';

export class NewsSourceDao extends Dao<NewsSourceResponse, CreateNewsSourceRequest, UpdateNewsSourceRequest> {
    constructor() {
        const daoConfig: DaoConfigInterface = {
            tableName: 'news_sources',
            searchFields: ['name', 'website_url'],
            filterFields: ['non_profit', 'sells_ads', 'country'],
            sortFields: ['created', 'name'],
            defaultOffset: 0,
            defaultLimit: 15,
            defaultSort: ['name']
            // findManyCustomQuery: `SELECT * FROM news_sources`,
            // findOneCustomQuery: `SELECT name, website_url, id FROM news_sources WHERE id=:id`,
            // TODO:
        };
        super(daoConfig);
    }

    getResourceInstance() {
        return new NewsSourceResponse();
    }
}