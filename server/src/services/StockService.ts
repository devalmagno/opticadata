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
        const stockAlreadyExists = await this.stockRepository.find({
            where: { product_id }
        });

        let quantityInStock = 0;

        if (stockAlreadyExists) {
            stockAlreadyExists.forEach(stock => {
                if (stock.entry == true) {
                    quantityInStock += stock.quantity;
                } else {
                    quantityInStock -= stock.quantity;
                }
            })
        }

        if (entry == false && (!stockAlreadyExists || quantityInStock < quantity)) throw new Error ("You must have the corresponding or greater quantity in stock to make a subtraction.")
        
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