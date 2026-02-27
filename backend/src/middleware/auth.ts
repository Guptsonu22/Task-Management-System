import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { AuthRequest } from '../types';

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Access token is required');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Access token is required');
        }

        const payload = verifyAccessToken(token);
        req.userId = payload.userId;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Access token has expired'));
        } else if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError('Invalid access token'));
        } else {
            next(error);
        }
    }
};
