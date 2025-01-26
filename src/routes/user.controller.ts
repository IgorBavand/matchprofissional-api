import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    public router: Router;

    public constructor(private readonly userService: UserService) {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('/', this.createUser.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.post('/refresh-token', this.refreshToken.bind(this));
    }

    private async createUser(req: Request, res: Response) {
        await this.userService.createUser(req, res);
    }

    private async login(req: Request, res: Response) {
        await this.userService.login(req, res);
    }

    private async refreshToken(req: Request, res: Response) {
        await this.userService.refreshToken(req, res);
    }
}