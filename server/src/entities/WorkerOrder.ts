import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Order } from "./Order";
import { Worker} from './Worker';

@Entity("workers_order")
class WorkerOrder {
    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "order_id" })
    @ManyToOne(() => Order)
    order: Order;

    @Column()
    order_id: string;

    @JoinColumn({ name: "worker_id" })
    @ManyToOne(() => Worker)
    worker: Worker;

    @Column()
    worker_id: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid(); 
        }
    }
}

export { WorkerOrder };