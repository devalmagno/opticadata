import { Request, Response } from "express";

import { ProductsService } from "../services/ProductsService";

class ProductsController {

    async create(req: Request, res: Response) {
        const { bar_code ,name, cost_price, unit_price, total_sold, amount } = req.body;

        const productsService = new ProductsService();

        try {
            const product = await productsService.create({
                bar_code,
                name,
                cost_price,
                unit_price,
                amount
            });

            return res.status(201).json(product);
        } catch(err) {
            return res.status(401).json(err.message);
        }
    }

    async getProducts(req: Request, res: Response) {
        const productsService = new ProductsService();

        const products = await productsService.getProducts();

        return res.status(200).json(products);
    }

    async getProductByBarCode(req: Request, res: Response) {
        const { id } = req.params;

        const productsService = new ProductsService();

        try {
            const product = await productsService.getProductById(id);

            return res.status(200).json(product);
        } catch(err) {
            return res.status(400).json(err.message);
        }
    }

    async updateProduct(req: Request, res: Response) {
        const { id } = req.params;
        const { name, cost_price, unit_price, amount } = req.body;

        const productsService = new ProductsService();

        try {
            const product = await productsService.updateProduct({
                id,
                name,
                cost_price,
                unit_price,
                amount
            });

            return res.status(200).json(product);
        } catch(err) {
            return res.status(400).json(err.message);
        }
    }

    async removeProduct(req: Request, res: Response) {
        const { id } = req.params;

        const productsService = new ProductsService();

        try {
            const product = await productsService.removeProduct(id);

            res.status(201).json(product);
        } catch(err) {
            res.status(400).json({ err: err.message });
        }
    }
}

export { ProductsController };