// Import db object for use w/ extra custom methods
import { camelizeKeys, decamelizeKeys } from 'humps';

import { db } from './../services/db';
import { DaoConfigInterface } from './DaoConfigInterface';
import { AbstractDao } from './AbstractDao';
import { UserResponse } from './../models/UserResponse';
import { ListNewsSourceRequest } from './../models/ListNewsSourceRequest';
import { CreateNewsSourceRequest } from './../models/CreateNewsSourceRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';

export class UserDao extends AbstractDao<UserResponse, ListNewsSourceRequest, CreateNewsSourceRequest, UpdateNewsSourceRequest> {
    constructor() {
        const daoConfig: DaoConfigInterface = {
            tableName: 'users',
            searchFields: ['full_name', 'id', 'email'],
            filterFields: ['user_type'],
            sortFields: ['created', 'full_name'],
            defaultOffset: 0,
            defaultLimit: 15,
            defaultSort: ['-created']
            // findManyCustomQuery: `SELECT * FROM news_sources`,
            // findOneCustomQuery: `SELECT name, website_url, id FROM news_sources WHERE id=:id`
        };
        super(daoConfig);
    }

    mapRowToResourceInstance(row: {}): UserResponse {
        // if empty object, return null:
        if (!row || Object.keys(row).length === 0) {
            return null;
        }
        
        // convert row prop names to camel case (to match resource prop names)
        const camelRow = camelizeKeys(row);

        // assign camelizedRow props to resource instance
        return Object.assign(new UserResponse(), camelRow);
    }
}