import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MinProperties, MinLength, Minimum, Maximum, Format, Enum } from "ts-express-decorators/ajv";
import { ListQueryParams } from './ListQueryParams';
import { CountryAbbrevType, CountryAbbrevEnumArr } from './../enums/CountryAbbrevType';

export class ListNewsSourceRequest extends ListQueryParams {
    @PropertyType(Boolean)
    @PropertyName('non_profit')
    nonProfit: boolean;
    
    @PropertyType(Boolean)
    @PropertyName('sells_ads')
    sellsAds: boolean;

    @Enum(...CountryAbbrevEnumArr)
    countries: CountryAbbrevType[];
}