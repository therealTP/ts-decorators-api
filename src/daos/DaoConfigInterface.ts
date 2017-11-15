export interface DaoConfigInterface {
    // name of table in db:
    tableName: string;
    // searchable fields in findMany method:
    searchFields: string[];
    // filterable fields in findMany method:
    filterFields: string[];
    // sortable fields in findMany method:
    sortFields: string[];
    // default QueryOptions for findMany method:
    defaultOffset?: number;
    defaultLimit?: number;
    defaultSort?: string[];
    // Optional queries to use in lieu of pogi methods:
    findManyCustomQuery?: string;
    findOneCustomQuery?: string;
    // Maps request data to DB columns:
    columnMap?: {}
}