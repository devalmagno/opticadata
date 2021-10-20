import { getCustomRepository, Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    password?: string;
    commission?: number;
}

class WorkersService {
    private WorkersRepository : Repository<Worker>;

    constructor() {
        this.WorkersRepository = getCustomRepository(WorkersRepository);
    }

    async create({ occupation_id, name, email, phone, cpf }: IWorkersCreate) {
        const workerAlreadyExists = await this.WorkersRepository.findOne({
            cpf,
            email
        });

        if (workerAlreadyExists) {
            throw new Error("Worker already exists!!");
        }

        const password = "admin";

        const hashedPassword = await bcrypt.hash(password, 10);

        const worker = this.WorkersRepository.create({
            occupation_id,
            name,
            email,
            phone,
            cpf,
            password: hashedPassword
        });

        await this.WorkersRepository.save(worker);

        return worker;
    }

    async getWorkers() {
        const workers = await this.WorkersRepository.find();

        if (!workers) {
            throw new Error("There is no worker in the database, please create an worker before doing this operation.");
        }

        return workers;
    }

    async getWorkerById(id: string) {
        const worker = await this.WorkersRepository.findOne({
            id,
        });

        if (!worker) {
            throw new Error ("Worker does not exists!!");
        }

        return worker;
    }

    async updateBasicWorkerInfo(id: string, name?: string, email?: string, phone?: string) {
        const worker = await this.WorkersRepository.findOne({ id });

        if (!worker) {
            throw new Error ("Worker does not exists!!");
        }

        this.WorkersRepository.merge(worker, { name, email, phone });

        const updatedWorker = await this.WorkersRepository.save(worker);

        return updatedWorker;
    }

    async changeWorkerOccupation(id: string, occupation_id: string) {
        const worker = await this.WorkersRepository.findOne({ id });

        if (!worker) {
            throw new Error ("Worker does not exists!!");
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
            throw new Error ("Worker does not exists!!");
        }

        await this.WorkersRepository.remove(worker);

        return worker;
    }

    async login(cpf: string, password: string) {
        const workerPassword = await this.WorkersRepository.findOne({
            where: { cpf },
            select: ["password"]
        }); 

        if (!workerPassword) {
            throw new Error("Worker does not exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, workerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords do not match!");
        }

        const worker = await this.WorkersRepository.findOne({ cpf });

        const acessToken = jwt.sign({ worker }, process.env.ACESS_TOKEN_SECRET, { expiresIn: '30m' });

        return acessToken;
    }

    async changePassword(id: string, password: string, newPassword: string) {
        const workerPassword = await this.WorkersRepository.findOne({
            where: { id },
            select: ["password"]
        }); 

        if (!workerPassword) {
            throw new Error("Worker does not exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, workerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords do not match!");
        }

        const worker = await this.WorkersRepository.findOne({ id });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        this.WorkersRepository.merge(worker, { password: hashedPassword });

        const updatedWorker = await this.WorkersRepository.save(worker);

        return updatedWorker;
    }

    async authenticateToken(token: string) {
        jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err) => {
            if (err) throw new Error(err.message);

            return true;
        })
    } 
}

export { WorkersService };