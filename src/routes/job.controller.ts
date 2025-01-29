import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware';
import {JobService} from "../services/job.service";
import {authCompanyMiddleware} from "../middlewares/auth-company.middleware";
import {CompanyService} from "../services/company.service";

export class JobController {
    public router: Router;

    public constructor(private readonly jobService: JobService, private readonly companyService: CompanyService) {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('/', authCompanyMiddleware(this.companyService), this.createJob.bind(this));
        this.router.get('/', this.getAllJobs.bind(this));
    }

    private async createJob(req: Request, res: Response) {
        await this.jobService.createJob(req, res);
    }

    async getAllJobs(req: Request, res: Response) {
        try {
            await this.jobService.getAllJobs(req, res);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}