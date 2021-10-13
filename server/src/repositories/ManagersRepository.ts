import { EntityRepository, Repository } from "typeorm";

import { Manager } from "../entities/Manager";

@EntityRepository(Manager)
class ManagersRepository extends Repository<Manager> {

}

export { ManagersRepository };