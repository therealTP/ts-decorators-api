import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from './../models/UserResponse';
import { ITokenData } from './../interfaces/TokenData';

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
        {expiresIn: '1d'}
    );

    return token;
};

const verifyToken = (token) => {
    try {
        const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
        return tokenData;
    } catch(e) {

    }
};

export {
    hashPassword,
    comparePasswordWithHash,
    generateToken,
    verifyToken
}