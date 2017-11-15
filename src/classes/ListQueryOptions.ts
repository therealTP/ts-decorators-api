// Source: http://pogi.readthedocs.io/en/latest/API/QueryOptions/
import { QueryOptions } from 'pogi';

export abstract class ListQueryOptions implements QueryOptions {
    public limit: number;
    public offset: number;
    public orderBy: string[];
    public skipUndefined: boolean;

    constructor(limit: string, offset: string, sort: string) {
        if (limit) this.limit = parseInt(limit);
        if (offset) this.offset = parseInt(offset)
        if (sort) this.orderBy = sort.split(",");
         // default:
        this.skipUndefined = true;
    }
}