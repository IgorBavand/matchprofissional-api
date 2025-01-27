import { Job } from '../entities/job.entity';
import { Seniority } from '../enums/seniority.enum';
import { BaseRepository } from './base.repository';
import { type Repository } from 'typeorm';
export class JobRepository extends BaseRepository<Job> {
    public constructor(repository: Repository<Job>) {
        super(repository);
    }
    public async findByTitle(title: string): Promise<Job | null> {
        return await this.repository.findOne({ where: { title } });
    }
    public async findByDescription(description: string): Promise<Job | null> {
        return await this.repository.findOne({ where: { description } });
    }
    public async findBySalary(salary: number): Promise<Job | null> {
        return await this.repository.findOne({ where: { salary } });
    }
    public async findBySeniority(seniority: Seniority): Promise<Job | null> {
        return await this.repository.findOne({ where: { seniority } });
    }
}
