import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {Company} from "./company.entity";

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
    contractType: string; // CLT, PJ, Estágio, Cooperado

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column({ length: 50 })
    seniority: string; // Júnior, Pleno, Sênior

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Company, company => company.jobs)
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}