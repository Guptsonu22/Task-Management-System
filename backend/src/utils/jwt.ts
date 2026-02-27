import jwt from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload } from '../types';

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId } as TokenPayload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiry,
    } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId } as TokenPayload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiry,
    } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
    const expiry = config.jwt.refreshExpiry;
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * (multipliers[unit] || multipliers['d']));
};
