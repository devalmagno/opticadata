import { getCustomRepository, Repository } from "typeorm";

import { Installment } from "../entities/Installment";
import { InstallmentsRepository } from "../repositories/InstallmentsRepository";

interface IInstallmentsCreate {
    payment_id: string;
    price: number;
    payment_date: Date;
}

class InstallmentsService {
    private installmentsRepository : Repository<Installment>;

    constructor() {
        this.installmentsRepository = getCustomRepository(
            InstallmentsRepository
        );
    }

    async create({ payment_date, payment_id, price } : IInstallmentsCreate) {
        const installment = this.installmentsRepository.create({
            payment_id,
            payment_date,
            price
        });

        await this.installmentsRepository.save(installment);

        return installment;
    }

    async getInstallments() {
        const installments = await this.installmentsRepository.find();

        return installments;
    }

    async getInstallmentsByPayment(payment_id: string) {
        const installments = await this.installmentsRepository.find({
            where: { payment_id }
        })

        return installments;
    }

    async getInstallmentsByDate(payment_date: Date) {
        const installments = await this.installmentsRepository.find({
            where: { 
                payment_date,
                status: false
            }
        });

        return installments;
    }

    async updateInstallment(id: string) {
        const installment = await this.installmentsRepository.findOne({
            id,
        });

        const status = true;

        this.installmentsRepository.merge(installment, { status });

        const updatedInstallment = await this.installmentsRepository.save(installment);

        return updatedInstallment;
    }
}

export { InstallmentsService };
