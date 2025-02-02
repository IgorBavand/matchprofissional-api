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
import {UserDTO} from "../dto/user.dto";

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

    static fromDTO(dto: UserDTO): User {
        const user = new User();
        user.id = dto.id;
        user.name = dto.name;
        user.email = dto.email;
        user.password = dto.password;
        user.curriculum = dto.curriculum;
        user.skills = dto.skills;
        user.createdAt = dto.createdAt;
        user.updatedAt = dto.updatedAt;
        user.applications = dto.applications ?? [];
        return user;
    }
}
