import { EntityRepository, Repository } from "typeorm";

import { ProductOrder } from "../entities/ProductOrder";

@EntityRepository(ProductOrder)
class ProductsOrderRepository extends Repository<ProductOrder> {
    
}

export { ProductsOrderRepository };