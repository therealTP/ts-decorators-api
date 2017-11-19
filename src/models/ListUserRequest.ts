import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MinProperties, MinLength, Minimum, Maximum, Format, Enum } from "ts-express-decorators/ajv";
import { ListQueryParams } from './ListQueryParams';
import { UserType, UserTypeArr } from './../enums/UserType';

export class ListUserRequest extends ListQueryParams {
    @Enum(...UserTypeArr)
    countries: UserType[];
}