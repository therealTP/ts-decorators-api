import { QueryOptions } from 'pogi';
import { camelizeKeys, decamelizeKeys } from 'humps';
import * as lo from 'lodash';

import { db } from './../services/db';
import { DaoConfigInterface } from './DaoConfigInterface';
import { ListQueryParams } from './../models/ListQueryParams';
import { generateQueryOptions, generateFindOptions } from './daoUtils';
import { handleDbErrorResponse } from './../services/errors';

export abstract class AbstractDao<ResourceResponseType, ListRequestType extends ListQueryParams, CreateRequestType, UpdateRequestType> {
    tableName: string;
    searchFields: string[];
    filterFields: string[];
    sortFields: string[];
    defaultOffset: number;
    defaultLimit: number;
    defaultSort: string[];
    findManyCustomQuery: string;
    findOneCustomQuery: string;

    constructor(config: DaoConfigInterface) {
        this.tableName = config.tableName;
        this.searchFields = config.searchFields;
        this.filterFields = config.filterFields;
        this.sortFields = config.sortFields;
        this.defaultOffset = config.defaultOffset;
        this.defaultLimit = config.defaultLimit;
        this.defaultSort = config.defaultSort;
        this.findManyCustomQuery = config.findManyCustomQuery;
        this.findOneCustomQuery = config.findOneCustomQuery;
    }

    /**
     * How do you want a row from the db to map to an instance of the resource?
     * @param row
     * @returns ResourceResponseType  
     */
    abstract mapRowToResourceInstance(row: {}): ResourceResponseType;

    /*
    BASIC CRUD FUNCTIONS
    More specific DAO methods defined/implemented in derived classes
    */
    public async findMany(listRequest: ListRequestType): Promise<ResourceResponseType[]> {
        try {
            // options for query, based on QueryParams in request:
            const queryOptions = generateQueryOptions(listRequest);
            const findOptions = generateFindOptions(listRequest);
            
            let rows;   
            // if a custom query exists in DAO config:
            if (this.findManyCustomQuery) {
                // run the custom query w/ find map as params:
                rows = await db.query(this.findManyCustomQuery, findOptions, queryOptions);
            } else {
                rows = await db.getTable(this.tableName).find(findOptions, queryOptions);
            }
            return rows.map(row => this.mapRowToResourceInstance(row));
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }
    
    public async findOneById(id: string): Promise<ResourceResponseType> {
        try {
            // if a custom query exists in DAO config:
            let row;
            if (this.findOneCustomQuery) {
                // run the custom query w/ readRequest as params:
                row = await db.query(this.findOneCustomQuery, {id});
            } else {
                // console.log("DB QUERY", this.tableName, {id});
                row = await db.getTable(this.tableName).findOne({id});
            }
            return this.mapRowToResourceInstance(row);
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }

    public async create(createRequest: CreateRequestType): Promise<ResourceResponseType> {
        try {
            // Right now, request data must map to DB columns (camelCase to snake_case)
            let createData = decamelizeKeys(createRequest);
            let created = await db.getTable(this.tableName).insertAndGet(createData);
            return this.mapRowToResourceInstance(created);
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }

    public async update(id: string, updates: UpdateRequestType): Promise<ResourceResponseType> {
        try {
            // Right now, request data must map to DB columns (camelCase to snake_case)
            let updateData = decamelizeKeys(updates);
            let updated = await db.getTable(this.tableName).updateAndGetOne({id}, updateData);
            return this.mapRowToResourceInstance(updated);
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }

    // Would only delete by id, so this method accepts string id
    public async delete(id: string): Promise<{}> {
        try {
            let deleted = await db.getTable(this.tableName).delete({id});
            return {};
        } catch(dbErr) {
            handleDbErrorResponse(dbErr);
        }
    }
}