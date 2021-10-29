import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Product } from "./Product";
import { Provider } from "./Provider";

@Entity("stock")
class Stock {

    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "product_id" })
    @ManyToOne(() => Product)
    product: Product;

    @Column()
    product_id: string;

    @JoinColumn({ name: "provider_id" })
    @ManyToOne(() => Provider)
    provider: Provider;

    @Column()
    provider_id: string;

    @Column()
    quantity: number;

    @Column()
    entry: Boolean;

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

export { Stock };