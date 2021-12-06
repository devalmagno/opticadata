import { getCustomRepository, Repository } from "typeorm";

import { Stock } from '../entities/Stock';
import { StockRepository } from "../repositories/StockRepository";

interface IStockCreate {
    product_id: string;
    provider_id?: string;
    quantity: number;
    entry?: boolean;
}

class StockService {
    private stockRepository : Repository<Stock>;

    constructor() {
        this.stockRepository = getCustomRepository(StockRepository);
    }

    async create({ 
        quantity, 
        product_id, 
        provider_id,
        entry = false
    }: IStockCreate) {
        const stock = this.stockRepository.create({
            quantity,
            product_id,
            provider_id,
            entry
        });

        await this.stockRepository.save(stock);

        return stock;
    }

    async getStocks() {
        const stocks = await this.stockRepository.find();

        if (!stocks) throw new Error("There is no stock in the database");

        return stocks;
    }

    async getStockByProduct(product_id: string) {
        const stock = await this.stockRepository.find({
            where: { product_id }
        });

        if (!stock) throw new Error("Stock do not exists");

        return stock;
    }
}

export { StockService };