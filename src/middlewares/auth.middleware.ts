import { type NextFunction, Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../enums/http-status.enum";


interface AuthenticatedRequest extends Request {
    user?: string | object;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'default_access_secret', (err, user) => {
        if (err) return res.sendStatus(HttpStatus.FORBIDDEN);
        req.user = user;
        next();
    });
}