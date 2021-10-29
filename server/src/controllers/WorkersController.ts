import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { WorkersService } from "../services/WorkersService";

class WorkersController {
    async create(req: Request, res: Response) {
        const { 
            occupation_id,
            name, 
            email, 
            phone, 
            cpf, 
        } = req.body;

        const workersService = new WorkersService();

        try {
            const worker = await workersService.create({
                occupation_id,
                name, 
                email, 
                phone, 
                cpf, 
            });
    
            return res.status(201).json({
                message: "Worker has been created sucessfully.",
                worker
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getWorkers(req: Request, res: Response) {
        const workersService = new WorkersService();

        try {
            const workers = await workersService.getWorkers();

            return res.status(200).json(workers);
        } catch(err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getWorkerById(req: Request, res: Response) {
        const { id } = req.params;

        const workersService = new WorkersService();

        try {
            const worker = await workersService.getWorkerById(id);

            return res.json(worker);
        } catch(err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateWorker(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        
        const workersService = new WorkersService();

        try {
            const worker = await workersService.updateBasicWorkerInfo(id, name, email, phone);
        
            res.status(201).json({
                message: "Worker has been updated sucessfully.",
                worker
            });
        } catch(err) {
            return res.status(400).json({ err: err.message });
        } 
    }

    async removeWorker(req: Request, res: Response) {
        const { id } = req.params;

        const workersService = new WorkersService();

        try {
            const worker = await workersService.removeWorker(id);

            return res.status(200).json({
                message: "Worker has been deleted sucessfully",
                worker
            });
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }     
    }

    async login(req: Request, res: Response) {
        const { cpf, password } = req.body;
        
        const workersService = new WorkersService();

        try {
            const acessToken = await workersService.login(cpf, password);

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

        const workersService = new WorkersService();

        try {
            const worker = await workersService.changePassword(id, password, newPassword);

            return res.status(200).json({
                message: "Password has been changed sucessfully.",
                worker
            });
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        const workersService = new WorkersService();

        if (token == null) return res.status(401).json({
            message: "Token is null"
        });

        try {
            await workersService.authenticateToken(token);

            next();
        } catch(err) {
            res.status(401).json({ message: err.message });
        }
    }
}

export { WorkersController };