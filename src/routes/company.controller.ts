import {Request, Response, Router} from 'express';
import {CompanyService} from "../services/company.service";

export class CompanyController {
    public router: Router;

    public constructor(private readonly companyService: CompanyService) {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('/', this.createCompany.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/refresh-token', this.refreshToken.bind(this));
    }

    private async createCompany(req: Request, res: Response) {
        await this.companyService.createCompany(req, res);
    }

    private async login(req: Request, res: Response) {
        await this.companyService.login(req, res);
    }

    private async refreshToken(req: Request, res: Response) {
        await this.companyService.refreshToken(req, res);
    }
}