import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("products")
class Product {

    @PrimaryColumn()
    id: string;

    @Column()
    bar_code: string;

    @Column()
    name: string;

    @Column()
    cost_price: number;

    @Column()
    unit_price: number;

    @Column()
    total_sold: number;

    @Column()
    amount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }

        if (!this.total_sold) {
            this.total_sold = 0;
        }
    }
}

export { Product };