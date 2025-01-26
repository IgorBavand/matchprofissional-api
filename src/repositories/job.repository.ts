import {AppDataSource} from "../config/database.config"
import { Job } from "../entities/job.entity"
export const jobRepository = AppDataSource.getRepository(Job)