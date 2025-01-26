import {User} from '../entities/user.entity';
import {BaseRepository} from './base.repository';
import {In, type Repository} from 'typeorm';

export class UserRepository extends BaseRepository<User> {
    public constructor(repository: Repository<User>) {
        super(repository);
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }
    public async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }
    public async findByCurriculum(curriculum: string): Promise<User | null> {
        return await this.repository.findOne({ where: { curriculum } });

    }

    public async findBySkills(skills: string[]): Promise<User | null> {
        return await this.repository.findOne({ where: { skills: In(skills) } });
    }
    
}
