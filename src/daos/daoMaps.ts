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