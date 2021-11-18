import { getCustomRepository, Repository } from "typeorm";

import { Order } from "../entities/Order";
import { OrdersRepository } from "../repositories/OrdersRepository";
import { InstallmentsService } from "./InstallmentsService";
import { PaymentsService } from "./PaymentsService";
import { ProductsOrderService } from "./ProductsOrderService";
import { WorkersOrderService } from "./WorkersOrderService";

interface IOrdersCreate {
    id?: string;
    customer_id: string;
    quantity: number;

    type_of_payment: string;
    
    payment_date: Date[];
    price: number;
    status: boolean;

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
        payment_date,
        products_id,
        type_of_payment,
        workers_id,
        price
    }: IOrdersCreate) {
        const paymentsService = new PaymentsService();
        const installmentsService = new InstallmentsService();
        const productsOrderService = new ProductsOrderService();
        const workersOrderService = new WorkersOrderService();

        if (payment_date.length > 1 && !customer_id) {
            throw new Error("To make a installment sale, the customer must be registered on the plataform.");
        }

        if (!products_id) {
            throw new Error("product_id not found.");
        }

        if (!workers_id) {
            throw new Error("worker_id not found.");
        }

        const payment = await paymentsService.create({
            type_of_payment,
        });

        const order = this.ordersRepository.create({
            payment_id: payment.id,
            customer_id,
        });

        await this.ordersRepository.save(order);

        const pricePInstallment = price / payment_date.length;

        payment_date.forEach(async (date) => {
            await installmentsService.create({
                payment_id: payment.id,
                price: pricePInstallment,
                payment_date: date,
            });
        });

        products_id.forEach(async (product_id) => {
            await productsOrderService.create({
                order_id: order.id,
                product_id,
                quantity
            })
        });

        workers_id.forEach(async (worker_id) => {
            await workersOrderService.create({
                order_id: order.id,
                worker_id
            })
        })

        return order;
    }

    async getOrders() {
        const orders = await this.ordersRepository.find();
        
        if (!orders) throw new Error("There is no order in the database.");

        return orders;
    }

    async getOrderById(id: string) {
        const order = await this.ordersRepository.findOne({
            id
        });

        if (!order) throw new Error("The order do not exists");

        const paymentsService = new PaymentsService();
        const installmentsService = new InstallmentsService();
        const productsOrderService = new ProductsOrderService();
        const workersOrderService = new WorkersOrderService();

        const payment = await paymentsService.getPaymentById(order.payment_id);
        const installments = await installmentsService.getInstallmentsByPayment(order.payment_id)

        const productsOrder = await productsOrderService.getProductOrderByOrderId(order.id);
        const workersOrder = await workersOrderService.getWorkersOrderByOrderId(order.id);

        const orderInfo = {
            order,
            productsOrder,
            payment,
            installments,
            workersOrder
        }

        return orderInfo;
    }

    async removeOrder(id: string) {
        const order = await this.ordersRepository.findOne({
            id
        });

        if (!order) throw new Error("The order do not exists");

        await this.ordersRepository.remove(order);

        const paymentsService = new PaymentsService();

        await paymentsService.removePayment(order.payment_id);

        return order;
    }
}

export { OrdersService };