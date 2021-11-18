import { Request, Response } from "express";

import { PaymentsService } from "../services/PaymentsService";

class PaymentsController {

    async getPayments(req: Request, res: Response) {
        const paymentsService = new PaymentsService();

        try {
            const payments = await paymentsService.getPayments();

            return res.status(200).json(payments);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getPaymentById(req: Request, res: Response) {
        const { id } = req.params;

        const paymentsService = new PaymentsService();

        try {
            const payment = await paymentsService.getPaymentById(id);

            return res.status(200).json(payment);
        } catch(err) {
            return res.status(400).json({ message : err.message });
        }
    }
}

export { PaymentsController };