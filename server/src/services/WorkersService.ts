import { getCustomRepository, Repository } from "typeorm";

import { Worker } from "../entities/Worker";
import { WorkersRepository } from "../repositories/WorkersRepository";
import { OccupationsService } from "./OccupationsService";

interface IWorkersCreate {
    id?: string;
    occupation_id: string;
    name: string; 
    email: string;
    phone: string;
    cpf: string;
    password: string;
    commission?: number;
}

class WorkersService {
    private WorkersRepository : Repository<Worker>;

    constructor() {
        this.WorkersRepository = getCustomRepository(WorkersRepository);
    }

    async create({ occupation_id, name, email, phone, cpf, password }: IWorkersCreate) {
        const workerAlreadyExists = await this.WorkersRepository.findOne({
            cpf,
            email
        });

        if (workerAlreadyExists) {
            throw new Error("Worker already exists!!");
        }

        const worker = this.WorkersRepository.create({
            occupation_id,
            name,
            email,
            phone,
            cpf,
            password
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

    async changeWorkerOccupation(id: string, occupation_id: string) {
        const worker = await this.WorkersRepository.findOne({ id });

        if (!worker) {
            throw new Error ("Worker doesn't exists!!");
        }

        this.WorkersRepository.merge(worker, { occupation_id });

        const updatedWorker = await this.WorkersRepository.save(worker);

        return updatedWorker;
    }

    async updateWorkerCommission(id: string, total_sold: number) {
        const worker = await this.WorkersRepository.findOne({ id });

        const occupationsService = new OccupationsService();

        const workerOccupation = await occupationsService.getOccupationById(worker.occupation_id);

        const newCommission = worker.commission + (total_sold * workerOccupation.commission_percentege); 

        this.WorkersRepository.merge(worker, { commission: newCommission });

        const updateWorker = await this.WorkersRepository.save(worker);

        return updateWorker;
    }

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