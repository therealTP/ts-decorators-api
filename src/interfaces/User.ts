import { UserType } from './../enums/UserType';

export interface IUser {
    id?: string;
    fullName?: string;
    email?: string;
    password?: string;
    following?: string[];
    userType?: UserType;
    facebookId?: string;
    gmailId?: string;
}