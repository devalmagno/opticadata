import { getCustomRepository, Repository } from "typeorm";

import { Provider } from "../entities/Provider";
import { ProvidersRepository } from "../repositories/ProvidersRepository";

interface IProvidersCreate {
    id?: string;
    cnpj?: string;
    name: string;
    phone: string;
}

class ProvidersService {
    private providersRepository : Repository<Provider>;

    constructor() {
        this.providersRepository = getCustomRepository(ProvidersRepository);
    }

    async create({ name, phone, cnpj }: IProvidersCreate) {
        const providerAlreadyExists = await this.providersRepository.findOne({ cnpj });

        if (providerAlreadyExists) {
            throw new Error("Provider already exists");
        }

        const provider = this.providersRepository.create({
            name,
            phone,
            cnpj
        });

        await this.providersRepository.save(provider);

        return provider;
    }

    async getProviders() {
        const providers = await this.providersRepository.find();

        if (!providers) throw new Error("There is no provider in the database.");

        return providers;
    }

    async updateProvider({ id, name, phone }: IProvidersCreate) {
        const provider = await this.providersRepository.findOne({
            id,
        });

        if (!provider) throw new Error("Provider does not exists!!");

        this.providersRepository.merge(provider, { name, phone });

        const updatedProvider = await this.providersRepository.save(provider);

        return updatedProvider;
    }

    async removeProvider(id: string) {
        const provider = await this.providersRepository.findOne({
            id,
        });

        if (!provider) throw new Error("Provider does not exists!!");

        this.providersRepository.remove(provider);

        return provider;
    }
}

export { ProvidersService };