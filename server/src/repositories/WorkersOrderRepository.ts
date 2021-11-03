import { EntityRepository, Repository } from "typeorm";
import { WorkerOrder } from "../entities/WorkerOrder";

@EntityRepository(WorkerOrder)
class WorkersOrderRepository extends Repository<WorkerOrder> {
    
}

export { WorkersOrderRepository };