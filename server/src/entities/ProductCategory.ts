import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("product_categories")
class ProductCategory {

    @PrimaryColumn()
    id: string;

    @Column({ length: 20 })
    name: string;

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

export { ProductCategory };