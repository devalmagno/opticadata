import { Request, Response } from "express";

import { ProductCategoriesService } from "../services/ProductCategoriesService";

class ProductCategoriesController {

    async create(req: Request, res: Response) {
        const { name } = req.body;

        const productCategoriesService = new ProductCategoriesService();

        try {
            const productCategory = await productCategoriesService.create(name);

            return res.status(201).json(productCategory);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async getProductCategories(req: Request, res: Response) {
        const productCategoriesService = new ProductCategoriesService();

        const productCategories = await productCategoriesService.getProductCategories();

        return res.status(200).json(productCategories);
    }

    async getProductCategoryById(req: Request, res: Response) {
        const { id } = req.params;
        
        const productCategoriesService = new ProductCategoriesService();

        try {
            const productCategory = await productCategoriesService.getProductCategoryById(id);

            return res.status(200).json(productCategory);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async updateProductCategory(req: Request, res: Response) {
        const { id } = req.params;
        const { name } = req.body;

        const productCategoriesService = new ProductCategoriesService();
        
        try {
            const productCategory = await productCategoriesService.updateProductCategory(id, name);

            return res.status(200).json(productCategory);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async removeProductCategory(req: Request, res: Response) {
        const { id } = req.params;

        const productCategoriesService = new ProductCategoriesService();

        try {
            const productCategory = await productCategoriesService.removeProductCategory(id);

            return res.status(200).json(productCategory);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }
}

export { ProductCategoriesController };