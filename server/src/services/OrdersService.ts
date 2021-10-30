import { getCustomRepository, Repository } from "typeorm";

import { Order } from "../entities/Order";
import { OrdersRepository } from "../repositories/OrdersRepository";
import { PaymentsService } from "./PaymentsService";

interface IOrdersCreate {
    id: string;
    customer_id: string;
    quantity: number;
    type_of_payment: string;
    times: number;
    date_of_payment: Date;
    products_id: string[];
    workers_id: string[]; 
}

class OrdersService {
    private ordersRepository : Repository<Order>;

    constructor() {
        this.ordersRepository = getCustomRepository(OrdersRepository);
    }

    async create({ 
        customer_id, 
        quantity, 
        date_of_payment,
        products_id,
        times,
        type_of_payment,
        workers_id 
    }: IOrdersCreate) {
        const paymentsService = new PaymentsService();

        const payment = await paymentsService.create({
            type_of_payment,
            times
        });

        const order = this.ordersRepository.create({
            payment_id: payment.id,
            customer_id,
            quantity
        });

        await this.ordersRepository.save(order);
    }
}

export { OrdersService };