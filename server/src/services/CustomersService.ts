import { getCustomRepository, Repository } from "typeorm";

import { Customer } from '../entities/Customer';
import { CustomersRepository } from "../repositories/CustomersRepository";

interface ICustomerCreate {
    cpf?: string;
    cnpj?: string;
    name: string;
    email: string;
    phone: string;
}

class CustomersService {
    private customersRepository : Repository<Customer>;

    constructor() {
        this.customersRepository = getCustomRepository(CustomersRepository);
    }

    async create({ email, name, phone, cnpj, cpf }: ICustomerCreate) {
        const customerAlreadyExists = await this.customersRepository.findOne({
            email,
            cpf,
            cnpj
        });

        if (customerAlreadyExists) {
            throw new Error("Customer already exists!!");
        }

        const customer = this.customersRepository.create({
            cpf,
            cnpj,
            name,
            email,
            phone
        });

        await this.customersRepository.save(customer);

        return customer;
    }

    async getCustomer(email: string) {
        const customer = await this.customersRepository.findOne({
            email
        });

        if (!customer) {
            throw new Error("Customer doesn't exists!!");
        } 

        return customer;
    }

    async remove(email: string) {
        const customer = await this.customersRepository.findOne({
            email
        });

        if (!customer) {
            throw new Error("Customer doesn't exists!!");
        }

        await this.customersRepository.remove(customer);

        return customer;
    }
}

export { CustomersService };