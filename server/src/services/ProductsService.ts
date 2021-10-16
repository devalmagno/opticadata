
import { getCustomRepository, Repository } from 'typeorm';

import { Product } from '../entities/Product';
import { ProductsRepository } from '../repositories/ProductsRepository';

interface IProductCreate {
    id?: string;
    productcategory_id: string;
    bar_code?: string;
    name: string;
    cost_price: number;
    unit_price: number;
    amount: number;
    total_sold?: number;
}

class ProductsService {
    private productsRepository : Repository<Product>;

    constructor() {
        this.productsRepository = getCustomRepository(ProductsRepository);
    }

    async create({ productcategory_id, bar_code ,name, cost_price, unit_price, amount }: IProductCreate) {
        const productAlreadyExists = await this.productsRepository.findOne({
            bar_code,
        });

        if (productAlreadyExists) {
            throw new Error("Product already exists!!");
        }

        const product = this.productsRepository.create({
            productcategory_id,
            bar_code,
            name,
            cost_price,
            unit_price,
            amount
        });

        await this.productsRepository.save(product);

        return product;
    }

    async getProducts() {
        const products = await this.productsRepository.find();

        return products;
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

    async updateProduct({ productcategory_id, id, name, cost_price, unit_price, amount, total_sold }: IProductCreate) {
        const product = await this.productsRepository.findOne({
            id,
        });

        if (!product) {
            throw new Error("Product doesn't exists!!");
        }

        this.productsRepository.merge(product, {
            name, 
            cost_price, 
            unit_price, 
            amount,
            productcategory_id,
            total_sold
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