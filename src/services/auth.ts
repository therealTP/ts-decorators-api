import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from './../models/UserResponse';
import { ITokenData } from './../interfaces/TokenData';

export {
    hashPassword,
    comparePasswordWithHash,
    generateToken,
    verifyToken
}

const hashPassword = (password) => {
    return bcrypt.hash(password, parseInt(process.env.HASH_SALT_COUNT));
};

const comparePasswordWithHash = (password, hash) => {
    return bcrypt.compare(password, hash);
};

const generateToken = (userData: UserResponse) => {
    const tokenData : ITokenData = {
        id: userData.id,
        fullName: userData.fullName,
        userType: userData.userType
    };
    
    const token = jwt.sign(
        tokenData, 
        process.env.TOKEN_SECRET, 
        {expiresIn: process.env.TOKEN_LIFE}
    );

    return token;
};

const verifyToken = (token) => {
    // this will throw an error if decoding fails or if token expired:
    const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);

    // if decoding succeeds, make sure token isn't expired:
    // if (tokenData.exp < Date.now()) {
    //     throw 'Error';
    // }

    return tokenData;
};