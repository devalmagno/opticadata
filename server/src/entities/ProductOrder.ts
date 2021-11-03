import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Order } from "./Order";
import { Product } from "./Product";

@Entity("products_order")
class ProductOrder {

    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "order_id" })
    @ManyToOne(() => Order)
    order: Order;

    @Column()
    order_id: string;

    @JoinColumn({ name: "product_id" })
    @ManyToOne(() => Product)
    product: Product;

    @Column()
    product_id: string;

    @Column()
    quantity: number;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid(); 
        }
    }
}

export { ProductOrder };