import { getCustomRepository, Repository } from "typeorm";

import { Manager } from "../entities/Manager";
import { ManagersRepository } from "../repositories/ManagersRepository";

interface IManagersCreate {
    name: string;
    email: string;
    phone_number: string;
    cpf: string;
    password: string;
}

class ManagersService {
    private ManagersRepository : Repository<Manager>;

    constructor() {
        this.ManagersRepository = getCustomRepository(ManagersRepository);
    }

    async create({ name, email, phone_number, cpf, password }: IManagersCreate) {
        const managerAlreadyExists = await this.ManagersRepository.findOne({
            cpf
        });

        if (managerAlreadyExists) {
            throw new Error("Manager already exists!");
        }

        const managers = this.ManagersRepository.create({
            name,
            email,
            phone_number,
            cpf,
            password
        });

        await this.ManagersRepository.save(managers);

        return managers;
    }

    async findManagerPasswordByCpf(cpf: string) {
        const manager = await this.ManagersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        return manager;
    }

    async findManagerByCpf(cpf: string) {
        const manager = await this.ManagersRepository.findOne({
            cpf,
        })

        return manager;
    }
}

export { ManagersService };