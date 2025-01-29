import { Request, Response } from 'express';
import { HttpStatus } from '../enums/http-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { JobRepository } from '../repositories/job.repository';
import { Job } from "../entities/job.entity";
import { JobDto } from "../dto/job.dto";
import { Company } from "../entities/company.entity";
import {Seniority} from "../enums/seniority.enum";
import {contractType} from "../enums/contract-type.enum";

export class JobService {
    public constructor(private readonly jobRepository: JobRepository) {}

    public async createJob(req: Request, res: Response): Promise<Response> {
        try {
            const {
                title,
                description,
                requirements,
                contractType,
                salary,
                seniority,
                companyId,
            } = req.body;

            const job: Job = new Job();
            job.id = uuidv4();
            job.title = title;
            job.description = description;
            job.requirements = Array.isArray(requirements) ? requirements : [];
            job.contractType = contractType;
            job.salary = salary;
            job.seniority = seniority;
            job.company = { id: companyId } as Company;
            job.applications = [];
            job.isActive = true;

            const savedJob = await this.jobRepository.save(job);

            const newJob: JobDto = {
                id: savedJob.id,
                title: savedJob.title,
                description: savedJob.description,
                requirements: savedJob.requirements,
                contractType: savedJob.contractType,
                salary: savedJob.salary,
                seniority: savedJob.seniority,
                isActive: savedJob.isActive,
                company: savedJob.company,
                applications: savedJob.applications,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            return res.status(HttpStatus.CREATED).json(newJob);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

    async getAllJobs(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filters = {
                companyId: req.query.companyId as string | undefined,
                contractType: req.query.contractType as contractType | undefined,
                seniority: req.query.seniority as Seniority | undefined,
                minSalary: req.query.minSalary ? parseFloat(req.query.minSalary as string) : undefined,
                maxSalary: req.query.maxSalary ? parseFloat(req.query.maxSalary as string) : undefined,
                isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
            };

            const [jobs, total] = await this.jobRepository.findJobs(page, limit, filters);

            return res.json({
                jobs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: error.message});
        }
    }
}
