import { Request, Response } from 'express';
import { UserDTO } from '../DTO/user.dto';
import { userRepository } from '../repositories/user.repository';

class UserService {

public constructor(readonly userRepository: userRepository) {}
    public async createUser(req: Request, res: Response){
        try {
            const { name, email, password, curriculum, skills } = req.body;
            const userExists = await userRepository.findOne({ where: { email } });

           
        } catch (error:any) {
        }
    }
}

export default new UserService();