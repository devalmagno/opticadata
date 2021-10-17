import { EntityRepository, Repository } from "typeorm";

import { Occupation } from "../entities/Occupation";

@EntityRepository(Occupation)
class OccupationsRepository extends Repository<Occupation> {

}

export { OccupationsRepository };