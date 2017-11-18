// Import db object for use w/ extra custom methods
import { camelizeKeys, decamelizeKeys } from 'humps';

import { db } from './../services/db';
import { DaoConfigInterface } from './DaoConfigInterface';
import { AbstractDao } from './AbstractDao';
import { NewsSourceResponse } from './../models/NewsSourceResponse';
import { ListNewsSourceRequest } from './../models/ListNewsSourceRequest';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';

export class NewsSourceDao extends AbstractDao<NewsSourceResponse, ListNewsSourceRequest, CreateNewsSourceRequest, UpdateNewsSourceRequest> {
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
            // findOneCustomQuery: `SELECT name, website_url, id FROM news_sources WHERE id=:id`
        };
        super(daoConfig);
    }

    mapRowToResourceInstance(row: {}): NewsSourceResponse {
        // if empty object, return null:
        if (!row || Object.keys(row).length === 0) {
            return null;
        }
        
        // convert row prop names to camel case (to match resource prop names)
        const camelRow = camelizeKeys(row);

        // assign camelizedRow props to resource instance
        return Object.assign(new NewsSourceResponse(), camelRow);
    }
}