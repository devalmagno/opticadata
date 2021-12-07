import { getCustomRepository, Repository } from "typeorm";

import { Occupation } from "../entities/Occupation";
import { OccupationsRepository } from "../repositories/OccupationsRepository";

interface IOccupationCreate {
    id?: string;
    name: string;
    commission_percentege: number;
}

class OccupationsService {
    private occupationsRepository : Repository<Occupation>;

    constructor() {
        this.occupationsRepository = getCustomRepository(OccupationsRepository);
    }

    async create({ id, name, commission_percentege }: IOccupationCreate) {
        const occupationAlreadyExists = await this.occupationsRepository.findOne({
            name,
        });

        if (occupationAlreadyExists) {
            throw new Error("Occupation already exists!!");
        }

        const occupation = this.occupationsRepository.create({
            id,
            name,
            commission_percentege
        });

        await this.occupationsRepository.save(occupation);

        return occupation;
    }

    async getOccupations() {
        const occupations = await this.occupationsRepository.find();

        if (!occupations) {
            throw new Error("There is no occupation in the database, please create an occupation before doing this operation.");
        }

        const occupationsInfo = occupations.map(occ => {
            return {
                id: occ.id,
                name: occ.name
            }
        });

        return occupationsInfo;
    }

    async getOccupationById(id: string) {
        const occupation = await this.occupationsRepository.findOne({
            id,
        });

        return occupation;
    }

    async updateOccupation(id: string, name?: string, commission_percentege?: number) {
        const occupation = await this.occupationsRepository.findOne({
            id,
        });

        if (!occupation) {
            throw new Error("Occupation doesn't exists!!");
        }

        this.occupationsRepository.merge(occupation, { name, commission_percentege });

        const updatedOccupation = await this.occupationsRepository.save(occupation);

        return updatedOccupation;
    }

    async removeOccupation(id: string) {
        const occupation = await this.occupationsRepository.findOne({
            id,
        });

        if (!occupation) {
            throw new Error("Occupation doesn't exists!!");
        }

        await this.occupationsRepository.remove(occupation);

        return occupation;
    }
}

export { OccupationsService };