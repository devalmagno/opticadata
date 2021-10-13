import { getCustomRepository, Repository } from "typeorm";

import { Worker } from "../entities/Worker";
import { WorkersRepository } from "../repositories/WorkersRepository";

interface IWorkersCreate {
    name: string; 
    email: string;
    phone: string;
    cpf: string;
    password: string;
    occupation: string;
    commission: number;
}

class WorkersService {
    private WorkersRepository : Repository<Worker>;

    constructor() {
        this.WorkersRepository = getCustomRepository(WorkersRepository);
    }

    async create({ name, email, phone, cpf, password, occupation, commission}: IWorkersCreate) {
        const workerAlreadyExists = await this.WorkersRepository.findOne({
            cpf,
            email
        });

        if (workerAlreadyExists) {
            throw new Error("Worker already exists!!");
        }

        const worker = this.WorkersRepository.create({
            name,
            email,
            phone,
            cpf,
            password,
            occupation,
            commission
        });

        await this.WorkersRepository.save(worker);

        return worker;
    }

    async findWorkerPasswordByCpf(cpf: string) {
        const worker = await this.WorkersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        return worker;
    }

    async findWorkerByCpf(cpf: string) {
        const worker = await this.WorkersRepository.findOne({
            cpf,
        })

        return worker;
    }

    async removeWorkerByCpf(cpf: string) {
        const worker = await this.WorkersRepository.findOne({ cpf });

        if (!worker) {
            throw new Error ("Worker doesn't exists!!");
        }

        await this.WorkersRepository.remove(worker);

        return worker;
    }
}

export { WorkersService };