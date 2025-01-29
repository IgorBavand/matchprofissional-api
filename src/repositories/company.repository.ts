import {BaseRepository} from './base.repository';
import {Repository} from 'typeorm';
import {Company} from "../entities/company.entity";

export class CompanyRepository extends BaseRepository<Company> {
    public constructor(repository: Repository<Company>) {
        super(repository);
    }

    public findByEmail(email: string): Promise<Company | null> {
        return this.repository.findOne({ where: { email } });
    }

    public findById(id: string): Promise<Company | null> {
        return this.repository.findOne({ where: { id } });
    }

}
