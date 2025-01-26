import {
    type UpdateResult,
    type ObjectLiteral,
    type Repository,
} from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
    public constructor(protected readonly repository: Repository<T>) {}

    public async list(): Promise<T[]> {
        return await this.repository.find();
    }

    public async save(model: T): Promise<T> {
        return await this.repository.save(model);
    }

    public async saveAll(model: T[]): Promise<T[]> {
        return await this.repository.save(model);
    }

    public async softDelete(model: T): Promise<UpdateResult> {
        return await this.repository.softDelete(model);
    }
}
