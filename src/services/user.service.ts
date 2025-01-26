import {Request, Response} from 'express';
import {UserDTO} from '../DTO/user.dto';
import {UserRepository} from '../repositories/user.repository';
import {HttpStatus} from '../enums/http-status.enum';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import {User} from "../entities/user.entity";
import jwt from "jsonwebtoken";
import {sign, verify} from 'jsonwebtoken';
import {TokenPayload} from "../DTO/token.dto";

export class UserService {
    public constructor(readonly userRepository: UserRepository) {
    }

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'User not found'});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Invalid credentials'});
            }

            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            const {password: _, ...userWithoutPassword} = user;

            return res.json({
                user: userWithoutPassword,
                accessToken,
                refreshToken
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "error.message"});
        }
    }

    private generateAccessToken(user: User): string {
        return jwt.sign(
            {id: user.id, email: user.email},
            process.env.ACCESS_TOKEN_SECRET || 'default_access_secret',
            {expiresIn: '15m'}
        );
    }

    private generateRefreshToken(user: User): string {
        return jwt.sign(
            {id: user.id, email: user.email},
            process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
            {expiresIn: '7d'}
        );
    }

    public async createUser(req: Request, res: Response) {
        try {
            const {name, email, password, curriculum, skills} = req.body;
            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                return res
                    .status(HttpStatus.CONFLICT)
                    .json({message: 'User already exists'});
            }

            const user: UserDTO = {
                id: uuidv4(),
                name,
                email,
                password,
                curriculum,
                skills,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const passwordHash = await bcrypt.hash(user.password, 10);
            user.password = passwordHash;

            const newUser = await this.userRepository.save(user);

            const {password: _, ...userWithoutPassword} = newUser;
            return res.status(HttpStatus.CREATED).json(userWithoutPassword);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message: error.message});
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Refresh token is required'});
            }

            try {
                const payload = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'
                ) as TokenPayload;

                const user = await this.userRepository.findById(payload.id);

                if (!user) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({message: 'User not found'});
                }

                const newAccessToken = this.generateAccessToken(user);

                return res.json({accessToken: newAccessToken});
            } catch (error) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Invalid refresh token'});
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "error.message"});
        }
    }

    async verifyToken(token: string, type: 'access' | 'refresh' = 'access'): Promise<TokenPayload> {
        const secret = type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET || 'default_access_secret'
            : process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

        try {
            const decoded = jwt.verify(token, secret) as TokenPayload;
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
