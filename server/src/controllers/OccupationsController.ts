import { Request, Response } from "express";
import { OccupationsService } from "../services/OccupationsService";


class OccupationsController {

    async create(req: Request, res: Response) {
        const {
            name, 
            commission_percentege
        } = req.body;

        const occupationsService = new OccupationsService();

        try {
            const occupation = await occupationsService.create({
                name,
                commission_percentege: commission_percentege | 0
            });

            return res.status(201).json(occupation);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async getOccupations(req: Request, res: Response) {
        const occupationsService = new OccupationsService();
        
        try {
            const occupations = await occupationsService.getOccupations();

            return res.status(200).json(occupations);
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async updateOccupation(req: Request, res: Response) {
        const { id } = req.params;
        const { name, commission_percentege } = req.body;
        
        const occupationsService = new OccupationsService();
        
        try {
            const occupation = await occupationsService.updateOccupation(id, name, commission_percentege);

            return res.status(200).json(occupation)
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }

    async removeOccupation(req: Request, res: Response) {
        const { id } = req.params;
        
        const occupationsService = new OccupationsService();
        
        try {
            const occupation = await occupationsService.removeOccupation(id);

            return res.status(200).json(occupation)
        } catch(err) {
            return res.status(400).json({ err: err.message });
        }
    }
}

export { OccupationsController };