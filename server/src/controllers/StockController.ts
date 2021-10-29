import { Request, Response } from "express";
import { StockService } from "../services/StockService";


class StockController {
    async create(req: Request, res: Response) {
        const { quantity, product_id, provider_id, entry } = req.body;

        const stockService = new StockService();

        try {
            const stock = await stockService.create({
                provider_id,
                product_id,
                entry,
                quantity
            });
        
            return res.status(201).json(stock);
        } catch(err) {
            return res.status(401).json({ message: err.message });
        }
    }

    async getStocks(req: Request, res: Response) {
        const stockService = new StockService();

        try {
            const stocks = await stockService.getStocks();
        
            return res.status(200).json(stocks);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getStocksByProduct(req: Request, res: Response) {
        const { product_id } = req.body;

        const stockService = new StockService();

        try {
            const stock = await stockService.getStockByProduct(product_id);
        
            return res.status(200).json(stock);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export { StockController };