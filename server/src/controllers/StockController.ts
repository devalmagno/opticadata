import { Request, Response } from "express";
import { StockService } from "../services/StockService";


class StockController {

    async create(req: Request, res: Response) {
        const { quantity, product_id, provider_id, entry } = req.body;

        const stockService = new StockService();

        try {

        } catch(err) {
            
        }
    }
}

export { StockController };