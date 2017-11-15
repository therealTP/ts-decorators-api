import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email } from "ts-express-decorators/ajv";
import { AbstractCreateRequest } from './../classes/AbstractCreateRequest';
import { INewsSource } from './../interfaces/NewsSource';
import { CountryAbbrevType, CountryAbbrevEnumArr } from './../enums/CountryAbbrevType';
/**
 * This model uses AJV to validate requests, experimental feature:
 */
export class CreateNewsSourceRequest extends AbstractCreateRequest implements INewsSource {
    @Required()
    @MinLength(3)
    name: string;

    @Required()
    @MinLength(6)
    websiteUrl: string;

    @Required()
    @MinLength(3)
    slug: string;

    @Required()
    nonProfit: boolean;

    @Required()
    sellsAds: boolean;

    @Required()
    @Enum(...CountryAbbrevEnumArr)
    country: CountryAbbrevType;
}