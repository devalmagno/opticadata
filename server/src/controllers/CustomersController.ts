import { Request, Response } from "express";

import { CustomersService } from "../services/CustomersService";

class CustomersController {
    async create(req: Request, res: Response) {
        const { email, name, phone, cnpj, cpf } = req.body;

        const customersService = new CustomersService();

        const customer = await customersService.create({
            email,
            name,
            phone,
            cnpj,
            cpf
        });

        return res.status(201).json(customer);
    }

    async getByEmail(req: Request, res: Response) {
        const { email } = req.params;

        const customersService = new CustomersService();

        const customer = await customersService.getCustomer(email);

        return res.json(customer);
    }

    async removeByEmail(req: Request, res: Response) {
        const { email } = req.params;

        const customersService = new CustomersService();

        const customer = await customersService.remove(email);

        return res.json(customer);
    }
}

export { CustomersController };