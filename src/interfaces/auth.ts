import { Request, Response } from "express";
import { AuthDto, ResAutenticateDto, ResAuthDto } from "../DTOs/auth";

export interface IAuthController {
    pLogin(req: Request, res: Response): Promise<void>
    gAutenticate(req: Request, res: Response): Promise<void>
    pLogout(req: Request, res: Response): Promise<void>
}

export interface IAuthService {
    login(auth: AuthDto, req: Request): Promise<ResAuthDto>
    authenticate(token: string): Promise<ResAutenticateDto>
}