import { getCustomRepository, Repository } from "typeorm";

import { ProductCategory } from "../entities/ProductCategory";
import { ProductCategoriesRepository } from "../repositories/ProductCategoriesRepository";

class ProductCategoriesService {
    private productCategoriesRepository : Repository<ProductCategory>;

    constructor() {
        this.productCategoriesRepository = getCustomRepository(ProductCategoriesRepository);
    }

    async create(name: string) {
        const productCategoryAlreadyExists = await this.productCategoriesRepository.findOne({
            name
        });

        if (productCategoryAlreadyExists) {
            throw new Error("Product category already exists!!");
        }

        const productCategory = this.productCategoriesRepository.create({
            name
        });

        await this.productCategoriesRepository.save(productCategory);

        return productCategory;
    }

    async getProductCategories() {
        const productCategories = await this.productCategoriesRepository.find();

        return productCategories;
    }

    async getProductCategoryById(id: string) {
        const productCategory = await this.productCategoriesRepository.findOne({
            id
        });

        if (!productCategory) {
            throw new Error("Product category doesn't exists!!");
        }

        return productCategory;
    }

    async updateProductCategory(id: string, name: string) {
        const productCategory = await this.productCategoriesRepository.findOne({
            id
        });

        if (!productCategory) {
            throw new Error("Product category doesn't exists!!");
        }

        this.productCategoriesRepository.merge(productCategory, { name });

        const updatedProductCategory = await this.productCategoriesRepository.save(productCategory);

        return updatedProductCategory;
    }

    async removeProductCategory(id: string) {
        const productCategory = await this.productCategoriesRepository.findOne({
            id
        });

        if (!productCategory) {
            throw new Error("Product category doesn't exists!!");
        }

        await this.productCategoriesRepository.remove(productCategory);

        return productCategory;
    }
}

export { ProductCategoriesService };