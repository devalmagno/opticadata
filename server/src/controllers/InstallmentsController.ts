import { Request, Response } from "express";
import { InstallmentsService } from "../services/InstallmentsService";


class InstallmentsController {

    async getInstallments(req: Request, res: Response) {
        const installmentsService = new InstallmentsService();

        try {
            const installments = await installmentsService.getInstallments();

            return res.status(200).json(installments);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getInstallmentsByPayment(req: Request, res: Response) {
        const { payment_id } = req.body;

        const installmentsService = new InstallmentsService();

        try {
            const installments = await installmentsService.getInstallmentsByPayment(payment_id);

            return res.status(200).json(installments);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async getInstallmentsByDate(req: Request, res: Response) {
        const payment_date = new Date(req.params.date);

        const installmentsService = new InstallmentsService();

        try {
            const installments = await installmentsService.getInstallmentsByDate(payment_date);

            return res.status(200).json(installments);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async updateInstallment(req: Request, res: Response) {
        const { id } = req.params;

        const installmentsService = new InstallmentsService();

        try {
            const installment = await installmentsService.updateInstallment(id);

            return res.status(200).json(installment);
        } catch(err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

export { InstallmentsController };