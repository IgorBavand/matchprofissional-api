import {Request, Response} from 'express';
import {HttpStatus} from '../enums/http-status.enum';
import {v4 as uuidv4} from 'uuid';
import {JobRepository} from '../repositories/job.repository';
import {Job} from "../entities/job.entity";
import {JobDto} from "../dto/job.dto";
import {Company} from "../entities/company.entity";
import {Seniority} from "../enums/seniority.enum";
import {contractType} from "../enums/contract-type.enum";
import {AuthenticatedRequest} from "../dto/authenticated-request.dto";
import {CompanyService} from "./company.service";
import {Application} from "../entities/application.entity";
import {User} from "../entities/user.entity";
import {ApplicationRepository} from "../repositories/application.repository";

export class JobService {
    public constructor(private readonly jobRepository: JobRepository, private readonly applicationRepository: ApplicationRepository) {}

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

    async applyToJob(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Usuário não autenticado." });
            }

            const { jobId } = req.params;
            const job = await this.getById(jobId);

            if (!job) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Vaga não encontrada." });
            }

            job.applications = job.applications ?? [];

            const user = req.user;

            const application = new Application();
            application.user = User.fromDTO(user);
            application.job = job;

            job.applications.push(application);

            await this.applicationRepository.save(application);
            await this.jobRepository.save(job);

            return res.status(HttpStatus.OK).json({ message: "Aplicação registrada com sucesso." });
        } catch (error: any) {
            console.error("Erro ao aplicar para vaga:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }


    async getById(id: string): Promise<Job | null> {
        return await this.jobRepository.findById(id);
    }

    async getAllJobs(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filters = {
                companyId: req.query.companyId as string | undefined,
                companyName: req.query.companyName as string,
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
