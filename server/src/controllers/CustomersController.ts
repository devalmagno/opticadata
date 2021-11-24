import { Request, Response } from "express";

import { CustomersService } from "../services/CustomersService";

class CustomersController {
    async create(req: Request, res: Response) {
        const { email, name, phone, cnpj, cpf } = req.body;

        const customersService = new CustomersService();

        try {
            const customer = await customersService.create({
                email,
                name,
                phone,
                cnpj,
                cpf
            });
    
            return res.status(201).json(customer);
        } catch(err) {
            return res.status(401).json({ message: err.message });
        }
    }

    async getCustomers(req: Request, res: Response) {
        const customersService = new CustomersService();
        
        try {
            const customers = await customersService.getCustomers();

            return res.status(200).json(customers);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getByEmail(req: Request, res: Response) {
        const { email } = req.params;

        const customersService = new CustomersService();

        try {
            const customer = await customersService.getCustomer(email);

            return res.status(200).json(customer);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async removeByEmail(req: Request, res: Response) {
        const { email } = req.params;

        const customersService = new CustomersService();

        try {
            const customer = await customersService.remove(email);

            return res.status(200).json(customer);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export { CustomersController };