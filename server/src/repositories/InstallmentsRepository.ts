import { EntityRepository, Repository } from "typeorm";

import { Installment } from "../entities/Installment";

@EntityRepository(Installment)
class InstallmentsRepository extends Repository<Installment> {

}

export { InstallmentsRepository };