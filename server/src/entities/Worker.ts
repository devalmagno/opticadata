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

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    cpf: string;

    @Column({ select: false })
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