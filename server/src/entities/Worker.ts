import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Occupation } from "./Occupation";

@Entity("workers")
class Worker {

    @PrimaryColumn()
    id: string;

    @JoinColumn({ name: "occupation_id" })
    @ManyToOne(() => Occupation)
    occupations: Occupation;

    @Column()
    occupation_id: string;

    @Column({ length: 40 })
    name: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 14 })
    phone: string;

    @Column({ length: 14 })
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

export { Worker };  