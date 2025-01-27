import express from 'express';
import { AppDataSource } from './config/database.config';
import { UserController } from './routes/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { CompanyController } from './routes/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyRepository } from './repositories/company.repository';
import { Company } from './entities/company.entity';
import { errorHandler } from './middlewares/error-handler.middleware';

AppDataSource.initialize().then(() => {
    const app = express();

    const userRepository = new UserRepository(
        AppDataSource.getRepository(User)
    );
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const companyRepository = new CompanyRepository(
        AppDataSource.getRepository(Company)
    );
    const companyService = new CompanyService(companyRepository);
    const companyController = new CompanyController(companyService);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/users', userController.router);
    app.use('/companies', companyController.router);
    app.use(errorHandler);

    app.listen(process.env.PORT, () => {
        console.log(
            `Server is running on port http://localhost:${process.env.PORT}`
        );
    });
});
