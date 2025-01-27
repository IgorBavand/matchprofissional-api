import 'dotenv/config';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { Job } from '../entities/job.entity';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { Application } from '../entities/application.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/../entities/*{.js,.ts}`],
    migrations: [`${__dirname}/../migrations/*{.js,.ts}`],
});
