export interface UserDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    curriculum: string;
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
    applications?: any[];
}