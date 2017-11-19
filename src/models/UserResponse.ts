import { IUser } from './../interfaces/User';
import { UserType } from './../enums/UserType';

export class UserResponse implements IUser {
    id: string;
    fullName: string;
    email: string;
    password: string;
    following: string[];
    userType: UserType;
    facebookId: string;
    gmailId: string;
    created: Date;
    updated: Date;
}