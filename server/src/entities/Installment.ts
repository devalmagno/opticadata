import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { Payment } from "./Payment";

@Entity("installments")
class Installment {
    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "payment_id" })
    @ManyToOne(() => Payment)
    payment: Payment;

    @Column()
    payment_id: string;

    @Column()
    price: number;

    @Column()
    payment_date: Date;

    @Column()
    status: boolean;

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

export { Installment };
