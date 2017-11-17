import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MinProperties, MinLength, Minimum, Maximum, Format } from "ts-express-decorators/ajv";

export class ListQueryParams {
    @PropertyType(String)
    @MinLength(2)
    q: string;
    
    @PropertyType(Number)
    limit: number;

    @PropertyType(Number)
    offset: number;

    @PropertyType(String)
    @MinProperties(1)
    order_by: string[];
}