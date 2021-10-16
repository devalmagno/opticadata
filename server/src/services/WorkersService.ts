import { getCustomRepository, Repository } from "typeorm";

import { Worker } from "../entities/Worker";
import { WorkersRepository } from "../repositories/WorkersRepository";

interface IWorkersCreate {
    id?: string;
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

    async getWorkers() {
        const workers = await this.WorkersRepository.find();

        return workers;
    }

    async findWorkerPasswordByCpf(cpf: string) {
        const worker = await this.WorkersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        return worker;
    }

    async getWorkerById(id: string) {
        const worker = await this.WorkersRepository.findOne({
            id,
        })

        return worker;
    }

    async getWorkerByCpf(cpf: string) {
        const worker = await this.WorkersRepository.findOne({
            cpf,
        });

        return worker;
    }

    async updateBasicWorkerInfo(id: string, name?: string, email?: string, phone?: string) {
        const worker = await this.WorkersRepository.findOne({ id });

        if (!worker) {
            throw new Error ("Worker doesn't exists!!");
        }

        this.WorkersRepository.merge(worker, { name, email, phone });

        const updatedWorker = await this.WorkersRepository.save(worker);

        return updatedWorker;
    }

    // async changeWorkerOccupation(id: string, occupation: string) {
    //     const worker = await this.WorkersRepository.findOne({ id });

    //     if (!worker) {
    //         throw new Error ("Worker doesn't exists!!");
    //     }

    //     this.WorkersRepository.merge(worker, { occupation });

    //     const updatedWorker = await this.WorkersRepository.save(worker);

    //     return updatedWorker;
    // }

    async removeWorker(id: string) {
        const worker = await this.WorkersRepository.findOne({ id });

        if (!worker) {
            throw new Error ("Worker doesn't exists!!");
        }

        await this.WorkersRepository.remove(worker);

        return worker;
    }
}

export { WorkersService };