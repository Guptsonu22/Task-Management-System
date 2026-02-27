import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';
import { validateEmail, validatePassword, validateName } from '../utils/validators';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors';
import { RegisterInput, LoginInput } from '../types';

export class AuthService {
    async register(input: RegisterInput) {
        const { email, name, password } = input;

        // Validate input
        if (!email || !name || !password) {
            throw new BadRequestError('Email, name, and password are required');
        }

        if (!validateEmail(email)) {
            throw new BadRequestError('Invalid email format');
        }

        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            throw new BadRequestError(nameValidation.message);
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            throw new BadRequestError(passwordValidation.message);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                name: name.trim(),
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async login(input: LoginInput) {
        const { email, password } = input;

        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        if (!validateEmail(email)) {
            throw new BadRequestError('Invalid email format');
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
        };
    }

    async refresh(refreshTokenStr: string) {
        if (!refreshTokenStr) {
            throw new BadRequestError('Refresh token is required');
        }

        // Verify the refresh token
        let payload;
        try {
            payload = verifyRefreshToken(refreshTokenStr);
        } catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        // Check if refresh token exists in DB
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshTokenStr },
        });

        if (!storedToken) {
            throw new UnauthorizedError('Refresh token not found');
        }

        if (storedToken.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });
            throw new UnauthorizedError('Refresh token has expired');
        }

        // Delete old refresh token
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });

        // Generate new tokens
        const accessToken = generateAccessToken(payload.userId);
        const newRefreshToken = generateRefreshToken(payload.userId);

        // Store new refresh token
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: payload.userId,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(refreshTokenStr: string) {
        if (!refreshTokenStr) {
            throw new BadRequestError('Refresh token is required');
        }

        // Delete the refresh token from DB
        try {
            await prisma.refreshToken.delete({
                where: { token: refreshTokenStr },
            });
        } catch {
            // Token might not exist, that's ok
        }

        return { message: 'Logged out successfully' };
    }
}

export const authService = new AuthService();
