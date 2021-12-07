import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { ProductCategory } from "./ProductCategory";

@Entity("products")
class Product {

    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "productcategory_id"})
    @ManyToOne(() => ProductCategory)
    product_categories: ProductCategory;

    @Column()
    productcategory_id: string;

    @Column({ length: 40 })
    name: string;

    @Column()
    unit_price: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { Product };