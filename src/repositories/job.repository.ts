import {Job} from '../entities/job.entity';
import {Seniority} from '../enums/seniority.enum';
import {BaseRepository} from './base.repository';
import {type Repository} from 'typeorm';
import {contractType} from "../enums/contract-type.enum";

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

    async findJobs(
        page: number,
        limit: number,
        filters?: {
            companyId?: string,
            contractType?: contractType;
            seniority?: Seniority;
            minSalary?: number;
            maxSalary?: number;
            isActive?: boolean;
        }
    ): Promise<[Job[], number]> {

        const query = this.repository
            .createQueryBuilder("job")
            .leftJoinAndSelect("job.company", "company")
            .leftJoinAndSelect("job.applications", "applications");

        if (filters) {
            if (filters.companyId) {
                query.andWhere("job.company.id = :companyId", { companyId: filters.companyId });
            }
            if (filters.contractType) {
                query.andWhere("job.contractType = :contractType", { contractType: filters.contractType });
            }
            if (filters.seniority) {
                query.andWhere("job.seniority = :seniority", { seniority: filters.seniority });
            }
            if (filters.minSalary !== undefined) {
                query.andWhere("job.salary >= :minSalary", { minSalary: filters.minSalary });
            }
            if (filters.maxSalary !== undefined) {
                query.andWhere("job.salary <= :maxSalary", { maxSalary: filters.maxSalary });
            }
            if (filters.isActive !== undefined) {
                query.andWhere("job.isActive = :isActive", { isActive: filters.isActive });
            }
        }

        query.skip((page - 1) * limit).take(limit);

        return query.getManyAndCount();
    }
}
