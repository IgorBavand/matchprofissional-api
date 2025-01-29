import {contractType} from "../enums/contract-type.enum";
import {Seniority} from "../enums/seniority.enum";
import {Company} from "../entities/company.entity";
import {Application} from "../entities/application.entity";

export interface JobDto {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    contractType: contractType;
    salary: number;
    seniority: Seniority;
    isActive: boolean;
    company: Company;
    applications: Application[];
    createdAt: Date;
    updatedAt: Date;
}
