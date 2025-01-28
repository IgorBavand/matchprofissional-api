import {Request, Response} from 'express';
import {UserDTO} from '../dto/user.dto';
import {UserRepository} from '../repositories/user.repository';
import {HttpStatus} from '../enums/http-status.enum';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import {User} from "../entities/user.entity";
import jwt from "jsonwebtoken";
import {TokenPayload} from "../dto/token.dto";

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
            const { name, email, password, curriculum, skills } = req.body;

            // Verificar se o usuário já existe
            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                return res
                    .status(HttpStatus.CONFLICT)
                    .json({ message: 'User already exists' });
            }

            // Criando o objeto UserDTO (para validação)
            const userDTO: UserDTO = {
                id: uuidv4(),
                name,
                email,
                password,
                curriculum,
                skills,
                createdAt: new Date(),
                updatedAt: new Date(),
                applications: [] // Inicializando applications como um array vazio
            };

            // Criptografando a senha
            const passwordHash = await bcrypt.hash(userDTO.password, 10);
            userDTO.password = passwordHash;

            // Criando o objeto User a partir do UserDTO
            const user: User = new User();
            user.id = userDTO.id;
            user.name = userDTO.name;
            user.email = userDTO.email;
            user.password = userDTO.password;
            user.curriculum = userDTO.curriculum;
            user.skills = userDTO.skills;
            user.createdAt = userDTO.createdAt;
            user.updatedAt = userDTO.updatedAt;
            user.applications = userDTO.applications || []; // Garantindo que applications seja um array vazio

            // Salvando o novo usuário
            const newUser = await this.userRepository.save(user);

            // Remover a senha do retorno
            const { password: _, ...userWithoutPassword } = newUser;
            return res.status(HttpStatus.CREATED).json(userWithoutPassword);

        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
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
