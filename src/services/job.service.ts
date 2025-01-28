import { Request, Response } from 'express';
import { HttpStatus } from '../enums/http-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { JobRepository } from '../repositories/job.repository';
import { Job } from "../entities/job.entity";
import { JobDto } from "../dto/job.dto";
import { Company } from "../entities/company.entity";

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
                applications: savedJob.applications
            };

            return res.status(HttpStatus.CREATED).json(newJob);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }
}
