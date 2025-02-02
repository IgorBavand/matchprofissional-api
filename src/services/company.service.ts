import {Request, Response} from 'express';
import {HttpStatus} from '../enums/http-status.enum';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {TokenPayload} from "../dto/token.dto";
import {CompanyRepository} from "../repositories/company.repository";
import {Company} from "../entities/company.entity";
import {CompanyDto} from "../dto/company.dto";

export class CompanyService {
    public constructor(readonly companyRepository: CompanyRepository) {
    }

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const company = await this.companyRepository.findByEmail(email);

            if (!company) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Company not found'});
            }

            const isPasswordValid = await bcrypt.compare(password, company.password);
            if (!isPasswordValid) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Invalid credentials'});
            }

            const accessToken = this.generateAccessToken(company);
            const refreshToken = this.generateRefreshToken(company);

            const {password: _, ...companyWithoutPassword} = company;

            return res.json({
                company: companyWithoutPassword,
                accessToken,
                refreshToken
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "error.message"});
        }
    }

    private generateAccessToken(company: Company): string {
        return jwt.sign(
            {id: company.id, email: company.email},
            process.env.ACCESS_TOKEN_SECRET || 'default_access_secret',
            {expiresIn: '15m'}
        );
    }

    private generateRefreshToken(company: Company): string {
        return jwt.sign(
            {id: company.id, email: company.email},
            process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
            {expiresIn: '7d'}
        );
    }

    public async createCompany(req: Request, res: Response) {
        try {
            const {name, cnpj, email, password, businessArea} = req.body;

            const companyExists = await this.companyRepository.findByEmail(email);
            if (companyExists) {
                return res
                    .status(HttpStatus.CONFLICT)
                    .json({message: 'Company with this email already exists'});
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const company = new Company();
            company.name = name;
            company.cnpj = cnpj;
            company.email = email;
            company.password = passwordHash;
            company.businessArea = businessArea;
            company.jobs = [];
            company.createdAt = new Date();
            company.updatedAt = new Date();

            const newCompany = await this.companyRepository.save(company);

            const {password: _, ...companyWithoutPassword} = newCompany;
            return res.status(HttpStatus.CREATED).json(companyWithoutPassword);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message: error.message});
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Refresh token is required'});
            }

            try {
                const payload = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret'
                ) as TokenPayload;

                const company = await this.companyRepository.findById(payload.id);

                if (!company) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Company not found'});
                }

                const newAccessToken = this.generateAccessToken(company);

                return res.json({accessToken: newAccessToken});
            } catch (error) {
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Invalid refresh token'});
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "error.message"});
        }
    }

    async verifyToken(token: string, type: 'access' | 'refresh' = 'access'): Promise<TokenPayload> {
        const secret = type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET || 'default_access_secret'
            : process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

        try {
            const decoded = jwt.verify(token, secret) as TokenPayload;
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async getById(id: string): Promise<Company | null> {
        return await this.companyRepository.findById(id);
    }

    async exists(id: string): Promise<boolean> {
        const company = await this.companyRepository.findById(id);
        return !!company;
    }
}
