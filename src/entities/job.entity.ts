import { IsNotEmpty } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { contractType } from '../enums/contract-type.enum';
import { Seniority } from '../enums/seniority.enum';
import { Application } from './application.entity';

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    @IsNotEmpty()
    title: string;

    @Column('text')
    @IsNotEmpty()
    description: string;

    @Column('simple-array')
    requirements: string[];

    @Column({ length: 50 })
    contractType: contractType;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column({ length: 50 })
    seniority: Seniority;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company) => company.jobs)
    company: Company;

    @OneToMany(() => Application, (application) => application.job)
    applications: Application[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
