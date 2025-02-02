import {Request} from "express";
import {UserDTO} from "./user.dto";

export interface AuthenticatedRequest extends Request {
    user?: UserDTO;
}
