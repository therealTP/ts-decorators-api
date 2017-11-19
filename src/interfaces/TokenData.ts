import { UserType } from './../enums/UserType';

export interface ITokenData {
    id: string;
    fullName: string;
    userType: UserType;
}