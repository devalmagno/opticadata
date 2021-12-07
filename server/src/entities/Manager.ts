import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { v4 as uuid } from "uuid";

@Entity("managers")
class Manager {
    @PrimaryColumn()
    id: string;

    @Column({length: 40})
    name: string;

    @Column({length: 100})
    email: string;

    @Column({length: 14})
    phone: string;

    @Column({length: 14})
    cpf: string;

    @Column({ select: false, length: 40 })
    password: string;

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

export { Manager };