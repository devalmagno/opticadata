import { getCustomRepository, Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const managers = this.ManagersRepository.create({
            name,
            email,
            phone_number,
            cpf,
            password: hashedPassword
        });

        await this.ManagersRepository.save(managers);

        return managers;
    }

    async getAllManagers() {
        const managers = await this.ManagersRepository.find();

        if (!managers) {
            throw new Error("There is no manager in the database, please create a manager before doing this operation.");
        }

        return managers;
    }

    async getManagerById(id: string) {
        const manager = await this.ManagersRepository.findOne({
            id,
        });

        if (!manager) {
            throw new Error("Manager doesn't exists!!");
        }

        return manager;
    }

    async findManagerPasswordByCpf(cpf: string) {
        const manager = await this.ManagersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        return manager;
    }

    async updateManager(id: string, name?: string, email?: string, phone_number?: string) {
        const manager = await this.ManagersRepository.findOne({ id });
        
        if (!manager) {
            throw new Error("Manager doesn't exists!!");
        }

        this.ManagersRepository.merge(manager, { name, email, phone_number });

        const updatedManager = await this.ManagersRepository.save(manager);

        return updatedManager;
    }

    async login(cpf: string, password: string) {
        const managerPassword = await this.ManagersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        if (!managerPassword) {
            throw new Error("Manager doesn't exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, managerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords don't matched");
        }

        const manager = await this.ManagersRepository.findOne({ cpf });

        const acessToken = jwt.sign({manager}, process.env.ACESS_TOKEN_SECRET, { expiresIn: '30m' });

        return acessToken;
    }

    async changePassword(id: string, password, newPassword) {
        const managerPassword = await this.ManagersRepository.findOne({
            where: { id },
            select: ["password"]
        });

        if (!managerPassword) {
            throw new Error("Manager doesn't exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, managerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords don't matched");
        }

        const manager = await this.ManagersRepository.findOne({ id });

        this.ManagersRepository.merge(manager, { password: newPassword });

        const updatedManager = await this.ManagersRepository.save(manager);

        return updatedManager;
    }

    async authenticateToken(token: string) {
        jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err) => {
            if (err) throw new Error(err.message);

            return true;
        });
    }
}

export { ManagersService };