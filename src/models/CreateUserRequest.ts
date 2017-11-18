import { Required, Property, PropertyName, PropertyType, Allow } from "ts-express-decorators";
import { MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email, Default } from "ts-express-decorators/ajv";
import { AbstractCreateRequest } from './../classes/AbstractCreateRequest';
import { IUser } from './../interfaces/User';

export class CreateUserRequest extends AbstractCreateRequest implements IUser {
    @Required()
    @MinLength(6)
    fullName: string;

    @Required()
    @MinLength(8)
    email: string;

    @Required()
    @MinLength(8)
    password: string;
}