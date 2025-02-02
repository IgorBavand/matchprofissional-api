import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Job } from './job.entity';
import { StatusApplication } from "../enums/status-application.enum";

@Entity('applications')
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ default: true })
    isActive: StatusApplication;

    @ManyToOne(() => User, user => user.applications)
    user: User;

    @ManyToOne(() => Job, job => job.applications)
    job: Job | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
