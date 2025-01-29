import { type NextFunction, Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../enums/http-status.enum";

interface AuthenticatedCompanyRequest extends Request {
    user?: { id: string };
}

export const authCompanyMiddleware = (companyService: any) => {
    return async (req: AuthenticatedCompanyRequest, res: Response, next: NextFunction): Promise<void> => {
        console.log("Middleware iniciado");

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        console.log("Token recebido:", token);

        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token não fornecido" });
            return;
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "default_access_secret", async (err, user) => {
            if (err) {
                res.status(HttpStatus.FORBIDDEN).json({ message: "Token inválido" });
                return;
            }

            if (typeof user === "object" && user !== null && "id" in user) {
                req.user = user as { id: string };

                try {
                    const companyExists = await companyService.exists(user.id);
                    if (!companyExists) {
                        res.status(HttpStatus.FORBIDDEN).json({ message: "Empresa não encontrada" });
                        return;
                    }

                    next();
                } catch (error) {
                    console.error("Erro ao verificar a empresa:", error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erro interno ao verificar a empresa" });
                    return;
                }
            } else {
                res.status(HttpStatus.FORBIDDEN).json({ message: "Token inválido ou estrutura de usuário incorreta" });
                return;
            }
        });
    };
};