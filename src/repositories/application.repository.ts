import {BaseRepository} from './base.repository';
import {Repository} from 'typeorm';
import {Application} from "../entities/application.entity";

export class ApplicationRepository extends BaseRepository<Application> {
    public constructor(repository: Repository<Application>) {
        super(repository);
    }

    public findById(id: string): Promise<Application | null> {
        return this.repository.findOne({ where: { id } });
    }

}
