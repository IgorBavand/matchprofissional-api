import { Request, Response } from 'express';
import { UserDTO } from '../DTO/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { HttpStatus } from '../enums/http-status.enum';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserResponse } from '../DTO/user-response.dto';
export class UserService {
    public constructor(readonly userRepository: UserRepository) {}
    public async createUser(req: Request, res: Response) {
        try {
            const { name, email, password, curriculum, skills } = req.body;
            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                return res
                    .status(HttpStatus.CONFLICT)
                    .json({ message: 'User already exists' });
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

            const { password: _, ...userWithoutPassword } = newUser;
            return res.status(HttpStatus.CREATED).json(userWithoutPassword);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }
}
