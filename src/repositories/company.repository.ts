import {BaseRepository} from './base.repository';
import {type Repository} from 'typeorm';
import {Company} from "../entities/company.entity";

export class CompanyRepository extends BaseRepository<Company> {
    public constructor(repository: Repository<Company>) {
        super(repository);
    }

    public async findByEmail(email: string): Promise<Company | null> {
        return await this.repository.findOne({ where: { email } });
    }
    public async findById(id: string): Promise<Company | null> {
        return await this.repository.findOne({ where: { id } });
    }
}
