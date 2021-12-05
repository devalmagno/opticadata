
import { getCustomRepository, Repository } from 'typeorm';

import { Product } from '../entities/Product';
import { ProductsRepository } from '../repositories/ProductsRepository';
import { StockService } from './StockService';

interface IProductCreate {
    id?: string;
    productcategory_id: string;
    name: string;
    unit_price: number;
}

class ProductsService {
    private productsRepository : Repository<Product>;

    constructor() {
        this.productsRepository = getCustomRepository(ProductsRepository);
    }

    async create({ productcategory_id, name, unit_price }: IProductCreate) {
        const productAlreadyExists = await this.productsRepository.findOne({
            name,
        });

        if (productAlreadyExists) {
            throw new Error("Product already exists!!");
        }

        const product = this.productsRepository.create({
            productcategory_id,
            name,
            unit_price
        });

        await this.productsRepository.save(product);

        return product;
    }

    async getProducts() {
        const products = await this.productsRepository.find();

        if (!products) throw new Error("There is no product data in the database");

        const stockService = new StockService();

        const stock = await stockService.getStocks();

        const productList = products.map(product => {
            let quantity = 0;

            stock.filter(stock => stock.product_id == product.id).map(stock => {
                if (stock.entry) quantity += stock.quantity;
                else quantity -= stock.quantity;
            })

            return {
                id: product.id,
                name: product.name,
                unit_price: product.unit_price,
                quantity
            }
        })

        return productList;
    }

    async getProductById(id: string) {
        const product = await this.productsRepository.findOne({
            id
        });

        if (!product) {
            throw new Error("Product doesn't exists!!");
        }

        return product;
    }

    async updateProduct({ productcategory_id, id, name, unit_price }: IProductCreate) {
        const product = await this.productsRepository.findOne({
            id,
        });

        if (!product) {
            throw new Error("Product doesn't exists!!");
        }

        this.productsRepository.merge(product, {
            name, 
            unit_price, 
            productcategory_id,
        });

        const updatedProduct = await this.productsRepository.save(product);

        return updatedProduct;
    }

    async removeProduct(id: string) {
        const product = await this.productsRepository.findOne({
            id,
        });

        if (!product) {
            throw new Error("Product doesn't exists!!");
        }

        this.productsRepository.remove(product);

        return product;
    }
}

export { ProductsService };