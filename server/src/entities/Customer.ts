import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("customers")
class Customer {

    @PrimaryColumn()
    id: string;

    @Column()
    cpf: string;

    @Column()
    cnpj: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

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

export { Customer }; 