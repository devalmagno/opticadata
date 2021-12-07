import { getCustomRepository, Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Manager } from "../entities/Manager";
import { ManagersRepository } from "../repositories/ManagersRepository";

interface IManagersCreate {
    id?: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
}

class ManagersService {
    private ManagersRepository : Repository<Manager>;

    constructor() {
        this.ManagersRepository = getCustomRepository(ManagersRepository);
    }

    async create({ id ,name, email, phone, cpf, password }: IManagersCreate) {
        const managerCPFAlreadyExists = await this.ManagersRepository.findOne({
            cpf
        });

        const managerEmailAlreadyExists = await this.ManagersRepository.findOne({
            email
        });

        if (managerCPFAlreadyExists || managerEmailAlreadyExists) {
            throw new Error("Manager already exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const managers = this.ManagersRepository.create({
            id,
            name,
            email,
            phone,
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
            throw new Error("Manager does not exists!!");
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

    async updateManager(id: string, name?: string, email?: string, phone?: string) {
        const manager = await this.ManagersRepository.findOne({ id });
        
        if (!manager) {
            throw new Error("Manager does not exists!!");
        }

        this.ManagersRepository.merge(manager, { name, email, phone });

        const updatedManager = await this.ManagersRepository.save(manager);

        return updatedManager;
    }

    async remove(id: string) {
        const manager = await this.ManagersRepository.findOne({ id });

        if (!manager) {
            throw new Error ("Worker does not exists!!");
        }

        await this.ManagersRepository.remove(manager);

        return manager;
    }

    async login(cpf: string, password: string) {
        const managerPassword = await this.ManagersRepository.findOne({
            where: { cpf },
            select: ["password"]
        });

        if (!managerPassword) {
            throw new Error("Manager does not exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, managerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords do not matched");
        }

        const manager = await this.ManagersRepository.findOne({ cpf });

        const acessToken = jwt.sign({manager}, "" + process.env.ACESS_TOKEN_SECRET, { expiresIn: '30m' });

        return { acessToken, manager };
    }

    async changePassword(id: string, password: string, newPassword: string) {
        const managerPassword = await this.ManagersRepository.findOne({
            where: { id },
            select: ["password"]
        });

        if (!managerPassword) {
            throw new Error("Manager does not exists!!");
        }

        const areSimilarPasswords = await bcrypt.compare(password, managerPassword.password);

        if (!areSimilarPasswords) {
            throw new Error("Passwords do not matched");
        }

        const manager = await this.ManagersRepository.findOne({ id });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        this.ManagersRepository.merge(manager, { password: hashedPassword });

        const updatedManager = await this.ManagersRepository.save(manager);

        return updatedManager;
    }

    async authenticateToken(token: string) {
        const manager = jwt.verify(token, "" + process.env.ACESS_TOKEN_SECRET, (err, manager) => {
            if (err) throw new Error(err.message);

            return manager;
        });

        return manager;
    }

    async authorizationReq(token: string) {
        jwt.verify(token, "" + process.env.ACESS_TOKEN_SCRET, (err) => {
            if (err) throw new Error(err.message);

            return true;
        })
    }
}

export { ManagersService };