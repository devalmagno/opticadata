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
            password, 
        } = req.body;

        const workersService = new WorkersService();

        const hashedPassword = await bcrypt.hash(password, 10);

        const worker = await workersService.create({
            occupation_id,
            name, 
            email, 
            phone, 
            cpf, 
            password: hashedPassword, 
        });

        return res.status(201).json(worker);
    }

    async getWorkers(req: Request, res: Response) {
        const workersService = new WorkersService();

        const workers = await workersService.getWorkers();

        return res.status(200).json(workers);
    }

    async getWorkerById(req: Request, res: Response) {
        const { id } = req.params;

        const workersService = new WorkersService();

        const worker = await workersService.getWorkerById(id);

        return res.json(worker);
    }

    async updateWorker(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        
        const workersService = new WorkersService();

        try {
            const worker = await workersService.updateBasicWorkerInfo(id, name, email, phone);
        
            res.status(201).json(worker);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        } 
    }

    async removeWorker(req: Request, res: Response) {
        const { id } = req.params;

        const workersService = new WorkersService();

        const worker = await workersService.removeWorker(id);

        return res.status(200).json(worker);
    }

    async login(req: Request, res: Response) {
        const { cpf, password } = req.body;
        
        const workersService = new WorkersService();

        const workerPass = await workersService.findWorkerPasswordByCpf(cpf);

        if (!workerPass) {
            return res.status(400).json({ err: "WRONG CPF or PASSWORD"})
        }

        try {
            if (await bcrypt.compare(password, workerPass.password)) {
                const worker = await workersService.getWorkerByCpf(cpf);

                const acessToken = jwt.sign({worker}, process.env.ACESS_TOKEN_SECRET, { expiresIn: '30m' });
                res.json({ acessToken });
            } else {
                res.status(400).json({ message: "Not Allowed" })
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    }

    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, worker) => {
            if (err) return res.status(403).json({ message: err.message });
            req.body = worker;
            next();
        })
    }
}

export { WorkersController };