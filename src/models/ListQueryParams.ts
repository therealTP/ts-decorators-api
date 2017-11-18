import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MinProperties, MinLength, Minimum, Maximum, Format, Default } from "ts-express-decorators/ajv";
import { QueryOptions } from 'pogi';

export class ListQueryParams implements QueryOptions {
    @PropertyType(String)
    @MinLength(2)
    q: string;
    
    @PropertyType(Number)
    limit: number;

    @PropertyType(Number)
    offset: number;

    @PropertyType(String)
    @PropertyName('order_by')
    orderBy: string;

    @PropertyType(Boolean)
    @Default(true)
    skipUndefined: boolean;
}