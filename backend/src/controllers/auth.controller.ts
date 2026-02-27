import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../types';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, name, password } = req.body;
            const result = await authService.register({ email, name, password });

            const response: ApiResponse = {
                success: true,
                message: 'User registered successfully',
                data: result,
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });

            const response: ApiResponse = {
                success: true,
                message: 'Login successful',
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refresh(refreshToken);

            const response: ApiResponse = {
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            await authService.logout(refreshToken);

            const response: ApiResponse = {
                success: true,
                message: 'Logged out successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
