import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email } from "ts-express-decorators/ajv";
import { INewsSource } from './../interfaces/NewsSource';
import { CountryAbbrevType } from './../enums/CountryAbbrevType';
/**
 * This model uses AJV to validate requests, experimental feature:
 */
export class NewsSourceResponse implements INewsSource {
    id: string;
    name: string;
    websiteUrl: string;
    slug: string;
    logoUrl: string;
    twitterUsername: string;
    youtubeUsername: string;
    nonProfit: boolean;
    sellsAds: boolean;
    country: CountryAbbrevType;
    created: Date;
    updated: Date;
    
    constructor() {

    }
}