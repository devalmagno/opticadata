import { Request, Response } from 'express';

import { ProvidersService } from '../services/ProvidersService';

class ProvidersControllers {

    async create(req: Request, res: Response) {
        const {
            cnpj,
            name,
            phone
        } = req.body;
 
        const providersService = new ProvidersService();

        try {
            const provider = await providersService.create({
                cnpj,
                name,
                phone
            });

            return res.status(201).json(provider);
        } catch(err) {
            return res.status(401).json(err.message)
        }
    }

    async getProviders(req: Request, res: Response) {
        const providersService = new ProvidersService();
        
        try {
            const providers = await providersService.getProviders();

            return res.status(201).json(providers);
        } catch(err) {
            return res.status(401).json(err.message)
        }
    }

    async updateProvider(req: Request, res: Response) {
        const { id } = req.params;
        const {
            name,
            phone
        } = req.body;

        const providersService = new ProvidersService();
        
        try {
            const provider = await providersService.updateProvider({ id, name, phone });

            return res.status(201).json(provider);
        } catch(err) {
            return res.status(401).json(err.message)
        }
    }

    async removeProvider(req: Request, res: Response) {
        const { id } = req.params;

        const providersService = new ProvidersService();
        
        try {
            const provider = await providersService.removeProvider(id);

            return res.status(201).json(provider);
        } catch(err) {
            return res.status(401).json(err.message)
        }
    }
}

export { ProvidersControllers };