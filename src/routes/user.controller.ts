import { Router } from 'express';
import { UserService } from '../services/user.service';
export class UserController {
    public router: Router;

    public constructor(private readonly userService: UserService) {
        this.router = Router();
        this.routes();
    }

    public routes() {
        this.router.post('/', async (req, res) => {
            this.userService.createUser(req, res);
        });
    }
}
