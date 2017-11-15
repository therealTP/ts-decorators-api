import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email } from "ts-express-decorators/ajv";
import { AbstractCreateRequest } from './../classes/AbstractCreateRequest';
import { INewsSource } from './../interfaces/NewsSource';
import { CountryAbbrevType, CountryAbbrevEnumArr } from './../enums/CountryAbbrevType';
/**
 * This model uses AJV to validate requests, experimental feature:
 */
export class UpdateNewsSourceRequest extends AbstractCreateRequest implements INewsSource {
    @MinLength(3)
    name: string;

    @MinLength(6)
    websiteUrl: string;
    
    @MinLength(3)
    slug: string;

    nonProfit: boolean;

    sellsAds: boolean;

    @Enum(...CountryAbbrevEnumArr)
    country: CountryAbbrevType;
}