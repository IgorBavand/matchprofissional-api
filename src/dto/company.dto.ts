import {Job} from "../entities/job.entity";

export interface CompanyDto {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    password: string;
    businessArea: string;
    jobs: Job[];
    createdAt: Date;
    updatedAt: Date;
}
