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
        });

        if (customerAlreadyExists) {
            throw new Error("Customer already exists!!")
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

    async getCustomers() {
        const customers = await this.customersRepository.find();

        if (!customers) throw new Error("There is no customer registered in the database.");

        return customers;
    }

    async getCustomer(email: string) {
        const customer = await this.customersRepository.findOne({
            email
        });

        if (!customer) {
            throw new Error("Customer does not exists!!");
        } 

        return customer;
    }

    async remove(email: string) {
        const customer = await this.customersRepository.findOne({
            email
        });

        if (!customer) {
            throw new Error("Customer does not exists!!");
        }

        await this.customersRepository.remove(customer);

        return customer;
    }
}

export { CustomersService };