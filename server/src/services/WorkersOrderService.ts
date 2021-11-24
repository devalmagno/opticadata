import { getCustomRepository, Repository } from "typeorm";
import { WorkerOrder } from "../entities/WorkerOrder";
import { WorkersOrderRepository } from "../repositories/WorkersOrderRepository";

interface IWorkerOrderCreate {
    order_id: string;
    worker_id: string;
}

class WorkersOrderService {
    private workersOrderRepository : Repository<WorkerOrder>;
    
    constructor() {
        this.workersOrderRepository = getCustomRepository(WorkersOrderRepository);
    }

    async create({ order_id, worker_id } : IWorkerOrderCreate) {
        const workerOrder = this.workersOrderRepository.create({
            order_id,
            worker_id
        });

        await this.workersOrderRepository.save(workerOrder);

        return workerOrder;
    }

    async getWorkersOrder() {
        const workersOrder = await this.workersOrderRepository.find();

        if (!workersOrder) throw new Error("There is no order in the database");

        return workersOrder;
    }

    async getWorkersOrderByOrderId(order_id: string) {
        const workerOrder = this.workersOrderRepository.find({
            where: { order_id },
        })

        return workerOrder;
    }

    async getWorkersOrderByWorkerId(worker_id: string) {
        const workerOrder = this.workersOrderRepository.find({
            where: { worker_id },
        })

        return workerOrder;
    }
}

export { WorkersOrderService };