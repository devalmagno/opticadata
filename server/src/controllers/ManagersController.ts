import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ManagersService } from "../services/ManagersService";

class ManagersController {
    async create(req: Request, res: Response) {
        const { name, email, phone_number, cpf, password } = req.body;

        const managersService = new ManagersService();

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const manager = await managersService.create({
                name,
                email,
                phone_number,
                cpf,
                password: hashedPassword
            });

            return res.status(201).json(manager);
        } catch(err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async getManagerByCpf(req: Request, res: Response) {
        const { cpf } = req.body.manager;

        const managersService = new ManagersService();

        const manager = await managersService.findManagerByCpf(cpf);

        return res.json(manager);
    }

    async login(req: Request, res: Response) {
        const { cpf, password } = req.body;
        
        const managersService = new ManagersService();

        const managerPass = await managersService.findManagerPasswordByCpf(cpf);

        if (!managerPass) {
            throw new Error("Manager doesn't exists!");
        }

        try {
            if (await bcrypt.compare(password, managerPass.password)) {
                const manager = await managersService.findManagerByCpf(cpf);

                const acessToken = jwt.sign({manager}, process.env.ACESS_TOKEN_SECRET, { expiresIn: '30m' });
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

        jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, manager) => {
            if (err) return res.status(403).json({ message: err.message });
            req.body = manager;
            next();
        })
    }
}

export { ManagersController };