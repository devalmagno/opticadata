import { getCustomRepository, Repository } from "typeorm";

import { ProductOrder } from "../entities/ProductOrder";
import { ProductsOrderRepository } from "../repositories/ProductsOrderRepository";

interface IProductsOrderCreate {
    order_id: string;
    product_id: string;
    quantity: number;
}

class ProductsOrderService {
    private productsOrderRepository : Repository<ProductOrder>;

    constructor() {
        this.productsOrderRepository = getCustomRepository(ProductsOrderRepository);
    }

    async create({ order_id, product_id, quantity } : IProductsOrderCreate) {
        const productOrder = this.productsOrderRepository.create({
            order_id,
            product_id,
            quantity
        });

        await this.productsOrderRepository.save(productOrder);

        return productOrder;
    }

    async getProductOrderByOrderId(order_id: string) {
        const productOrder = this.productsOrderRepository.find({
            where: { order_id },
        })

        return productOrder;
    }

    async getProductOrderByProductId(product_id: string) {
        const productOrder = this.productsOrderRepository.find({
            where: { product_id },
        })

        return productOrder;
    }
}

export { ProductsOrderService };