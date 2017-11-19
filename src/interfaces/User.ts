import { UserType } from './../enums/UserType';

export interface IUser {
    id?: string;
    fullName?: string;
    email?: string;
    hash?: string;
    following?: string[];
    userType?: UserType;
    facebookId?: string;
    gmailId?: string;
    created?: Date;
    updated?: Date;
}