import { Request, Response } from "express";

import { OrdersService } from "../services/OrdersService";

class OrdersController {
    async create(req: Request, res: Response) {
        const {
            customer_id,
            quantity,
            payment_date,
            products_id,
            type_of_payment,
            workers_id,
            status,
            price,
        } = req.body;

        const ordersService = new OrdersService();

        try {
            const order = await ordersService.create({
                customer_id,
                quantity,
                payment_date,
                products_id,
                type_of_payment,
                workers_id,
                status,
                price,
            });

            return res.status(201).json(order);
        } catch (err) {
            return res.status(401).json({ message: err.message });
        }
    }

    async getOrders(req: Request, res: Response) {
        const ordersService = new OrdersService();

        try {
            const orders = await ordersService.getOrders();

            return res.status(200).json(orders)
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getOrdersById(req: Request, res: Response) {
        const { id } = req.params;

        const ordersService = new OrdersService();

        try {
            const order = await ordersService.getOrderById(id);

            return res.status(200).json(order);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async removeOrder(req: Request, res: Response) {
        const { id } = req.params;

        const ordersService = new OrdersService();

        try {
            const order = await ordersService.removeOrder(id);

            return order;
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export { OrdersController };
