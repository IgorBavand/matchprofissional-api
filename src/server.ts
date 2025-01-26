import express from 'express';
import { AppDataSource } from './config/database.config';
import { UserController } from './routes/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';

AppDataSource.initialize().then(() => {
    const app = express();
    const userRepository = new UserRepository(AppDataSource.getRepository(User));
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/users', userController.router);

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port http://localhost:${process.env.PORT}`);
    });
});