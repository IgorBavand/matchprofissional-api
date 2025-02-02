import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {AppDataSource} from "./config/database.config";
import {UserController} from "./routes/user.controller";
import {UserRepository} from "./repositories/user.repository";
import {UserService} from "./services/user.service";
import {User} from "./entities/user.entity";
import {CompanyController} from "./routes/company.controller";
import {CompanyService} from "./services/company.service";
import {CompanyRepository} from "./repositories/company.repository";
import {Company} from "./entities/company.entity";
import {JobRepository} from "./repositories/job.repository";
import {Job} from "./entities/job.entity";
import {JobService} from "./services/job.service";
import {JobController} from "./routes/job.controller";
import {ApplicationRepository} from "./repositories/application.repository";
import {Application} from "./entities/application.entity";
import {errorHandler} from "./middlewares/error-handler.middleware";

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        const app = express();

        const allowedOrigins = ["http://localhost:4200", "https://matchprofissional.com.br", "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--4200--d20a0a75.local-credentialless.webcontainer-api.io"];
        app.use(cors({
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }));

        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        const userRepository = new UserRepository(AppDataSource.getRepository(User));
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);

        const companyRepository = new CompanyRepository(AppDataSource.getRepository(Company));
        const companyService = new CompanyService(companyRepository);
        const companyController = new CompanyController(companyService);

        const applicationRepository = new ApplicationRepository(AppDataSource.getRepository(Application));

        const jobRepository = new JobRepository(AppDataSource.getRepository(Job));
        const jobService = new JobService(jobRepository, applicationRepository);
        const jobController = new JobController(jobService, companyService);

        app.use("/users", userController.router);
        app.use("/companies", companyController.router);
        app.use("/jobs", jobController.router);

        app.use(errorHandler);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error initializing database:", err);
    });
