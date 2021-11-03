import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Customer } from "./Customer";
import { Payment } from "./Payment";

@Entity("orders")
class Order {

    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "payment_id" })
    @ManyToOne(() => Payment)
    payment: Payment;

    @Column()
    payment_id: string;

    @JoinColumn({ name: "customer_id" })
    @ManyToOne(() => Customer)
    customer: Customer;

    @Column()
    customer_id: string;

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

export { Order };