import { QueryOptions } from 'pogi';
import { camelizeKeys, decamelizeKeys } from 'humps';
import * as lo from 'lodash';

import { ListQueryParams } from './../models/ListQueryParams';

interface FieldMap {
    key: string;
}

export interface SearchMap {
    or: FieldMap[];
}

export interface FilterMap {
    and: FieldMap[];
}

export interface FindMap {
    and?: [SearchMap, FilterMap];
}

/*
FIND/LIST UTIL FUNCTIONS
Used to parse/map request data from ctrl to Pogi format
Assign defaults, restrict fields, etc. 
*/
const generateQueryOptions = (listRequest: ListQueryParams) => {
    const queryOptions : QueryOptions = {
        // set limit & offset defaults:
        offset: listRequest.offset ? listRequest.offset : this.defaultOffset,
        limit: listRequest.limit ? listRequest.limit : this.defaultLimit
    };
    
    // if orderBy string prop exists, split/convert to arr and filter:
    if (listRequest.orderBy) {
        queryOptions.orderBy = lo.remove(listRequest.orderBy.split(","), field => {
            // account for leading + / - and extra space
            const clean = field.replace(/\+|\-\s/ig, '');
            // remove any value that is not in the permitted orderBy fields array:
            return this.sortFields.indexOf(clean) === -1;
        });
    } else {
        queryOptions.orderBy = this.defaultSort;
    }

    return queryOptions;
}

const generateFindOptions = (listRequest: ListQueryParams) => {
    const filter = lo.mapValues(
        lo.pick(decamelizeKeys(listRequest), this.filterFields),
        (value: string | boolean) : string[] | string | boolean => {
            if (typeof value === 'string') return value.split(",");
            return value;
        });

    // This provides a default filter obj to include in final options:
    filter["id is not"] = null;

    const searchArray = listRequest.q ? this.searchFields.map(field => {
        return {
            // ILIKE = case insensitive
            [`${field} ilike`]: `%${listRequest.q}%`
        };
    }) : [{"id is not": null}];

    return {and: [{or: searchArray}, filter]};
}

export {
    generateQueryOptions,
    generateFindOptions
}