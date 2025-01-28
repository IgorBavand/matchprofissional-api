import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware';
import {JobService} from "../services/job.service";

export class JobController {
    public router: Router;

    public constructor(private readonly jobService: JobService) {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('/', authMiddleware, this.createJob.bind(this));
    }

    private async createJob(req: Request, res: Response) {
        await this.jobService.createJob(req, res);
    }

}