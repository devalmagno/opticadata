import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ManagersService } from "../services/ManagersService";

class ManagersController {
    async create(req: Request, res: Response) {
        const { name, email, phone, cpf, password } = req.body;

        const managersService = new ManagersService();

        try {
            const manager = await managersService.create({
                name,
                email,
                phone,
                cpf,
                password
            });

            return res.status(201).json({
                message: "Manager has been created sucessfully.",
                manager
            });
        } catch(err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async getAllManagers(req: Request, res: Response) {
        const managersService = new ManagersService();
        
        try {
            const managers = await managersService.getAllManagers();

            return res.status(200).json(managers);
        } catch(err) {
            res.status(400).json({ err: err.message });
        }
    }

    async getManagerById(req: Request, res: Response) {
        const { id } = req.body.manager;

        const managersService = new ManagersService();

        try {
            const manager = await managersService.getManagerById(id);

            res.status(200).json(manager);
        } catch(err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateManager(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const managersService = new ManagersService();

        try {
            const manager = await managersService.updateManager(id, name, email, phone);

            return res.status(200).json({
                message: "Manager has been updated sucessfully.",
                manager
            });
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async login(req: Request, res: Response) {
        const { cpf, password } = req.body;
        
        const managersService = new ManagersService();

        try {
            const acessToken = await managersService.login(cpf, password);

            return res.status(200).json({ acessToken: acessToken });
        } catch (err) {
            return res.status(401).json({
                message: err.message
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        const { id } = req.params;
        const { password, newPassword } = req.body;

        const managersService = new ManagersService();

        try {
            const manager = await managersService.changePassword(id, password, newPassword);

            return res.status(200).json({
                message: "Password has been changed sucessfully.",
                manager
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const managersService = new ManagersService();

        if (token == null) return res.status(401).json({ message: "Token is null"});

        try {
            await managersService.authenticateToken(token);

            next();
        } catch(err) {
            res.status(401).json({ message: err.message });
        }
    }
}

export { ManagersController };