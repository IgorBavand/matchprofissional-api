import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {Job} from "./job.entity";

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    @IsNotEmpty()
    name: string;

    @Column({ unique: true })
    @Length(14, 14)
    cnpj: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @Length(6, 255)
    password: string;

    @Column({ length: 100 })
    businessArea: string;

    @OneToMany(() => Job, job => job.company)
    jobs: Job[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
