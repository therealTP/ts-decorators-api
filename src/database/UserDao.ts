// Import db object for use w/ extra custom methods
import { camelizeKeys, decamelizeKeys } from 'humps';

import { db } from './../services/db';
import { handleDbErrorResponse } from './../services/errors';
import { DaoConfigInterface } from './DaoConfigInterface';
import { AbstractDao } from './AbstractDao';
import { UserResponse } from './../models/UserResponse';
import { ListUserRequest } from './../models/ListUserRequest';
import { RegisterUserRequest } from './../models/RegisterUserRequest';
import { UpdateNewsSourceRequest } from './../models/UpdateNewsSourceRequest';

export class UserDao extends AbstractDao<UserResponse, ListUserRequest, RegisterUserRequest, UpdateNewsSourceRequest> {
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
            // findOneCustomQuery: `SELECT id, full_name, email, password 
            //                     FROM users WHERE 
            //                     email=:id or facebook_id=:id or gmail_id=:id`
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

    async findOneByAltId(altId: string) {
        try {
            const row = await db.getTable(this.tableName).findOne( 
                {or: [
                    {email: altId}, 
                    {facebook_id: altId}, 
                    {gmail_id: altId}
                ]}
            );
            return this.mapRowToResourceInstance(row);
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }
}