import { Required } from "ts-express-decorators";
import { MinLength, Email} from "ts-express-decorators/ajv";
import { IUser } from './../interfaces/User';

export class LoginUserRequest implements IUser {
    @Required()
    @MinLength(3)
    @Email()
    email: string;

    @Required()
    @MinLength(8)
    password: string;
}