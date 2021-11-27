import { getCustomRepository, Repository } from "typeorm";

import { Order } from "../entities/Order";
import { OrdersRepository } from "../repositories/OrdersRepository";
import { CustomersService } from "./CustomersService";
import { InstallmentsService } from "./InstallmentsService";
import { OccupationsService } from "./OccupationsService";
import { PaymentsService } from "./PaymentsService";
import { ProductsOrderService } from "./ProductsOrderService";
import { ProductsService } from "./ProductsService";
import { WorkersOrderService } from "./WorkersOrderService";
import { WorkersService } from "./WorkersService";

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

    async getFullOrderInfo() {
        const orders = await this.ordersRepository.find();

        if (!orders) throw new Error("There is no order in the database.");

        const paymentsService = new PaymentsService();
        const installmentsService = new InstallmentsService();
        const productsOrderService = new ProductsOrderService();
        const workersOrderService = new WorkersOrderService();
        const customersService = new CustomersService();
        const productsService = new ProductsService();
        const workersService = new WorkersService();
        const occupationsService = new OccupationsService();

        const payments = await paymentsService.getPayments();
        const installments = await installmentsService.getInstallments();
        const customers = await customersService.getCustomers();
        const productsOrder = await productsOrderService.getProductsOrder();
        const workersOrder = await workersOrderService.getWorkersOrder();
        const products = await productsService.getProducts();
        const workers = await workersService.getWorkers();
        const occupations = await occupationsService.getOccupations();

        const fullOrder = orders.map(order => {
            return {
                order,
                payment: payments.filter(payment => payment.id == order.payment_id).map(payment => payment.type_of_payment),
                installment: installments.filter(installment => installment.payment_id == order.payment_id).map(ins => {
                    const formatedInstallment = {
                        id: ins.id,
                        date: ins.payment_date.toLocaleDateString("pt-BR"),
                        price: ins.price,
                        status: ins.status
                    }

                    return formatedInstallment;
                }),
                customer: customers.filter(customer => customer.id == order.customer_id).map(customer => customer.name),
                products: productsOrder.filter(product => product.order_id == order.id).map(productOrder => {
                    const productInfo = {
                        id: products.filter(product => product.id == productOrder.product_id).map(product => product.id)[0],
                        quantity: productOrder.quantity,
                        name: products.filter(product => product.id == productOrder.product_id).map(product => product.name)[0],
                        price: products.filter(product => product.id == productOrder.product_id).map(product => product.unit_price)[0]
                    }

                    return productInfo;
                }),
                workers: workersOrder.filter(worker => worker.order_id == order.id).map(workerOrder => {
                    const workerInfo = {
                        id: workers.filter(worker => worker.id == workerOrder.worker_id).map(worker => worker.id)[0],
                        name:  workers.filter(worker => worker.id == workerOrder.worker_id).map(worker => worker.name)[0],
                        occupation: occupations.filter(occupation => occupation.id == workers.filter(worker => worker.id == workerOrder.worker_id)[0].occupation_id)[0]?.name,
                    }

                    return workerInfo;
                })
            }
        });

        return fullOrder;
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