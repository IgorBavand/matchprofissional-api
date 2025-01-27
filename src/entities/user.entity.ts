import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Application } from './application.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    @IsNotEmpty()
    name: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @Length(6, 255)
    password: string;

    @Column({ type: 'text', nullable: true })
    curriculum: string;

    @Column('simple-array', { nullable: true })
    skills: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Application, (application) => application.user)
    applications: Application[];
}
