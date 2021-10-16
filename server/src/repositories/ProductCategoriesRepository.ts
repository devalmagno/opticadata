import { EntityRepository, Repository } from "typeorm";
import { ProductCategory } from "../entities/ProductCategory";

@EntityRepository(ProductCategory)
class ProductCategoriesRepository extends Repository<ProductCategory> {

}

export { ProductCategoriesRepository };