import { EntityRepository, Repository } from "typeorm";

import { Stock } from "../entities/Stock";

@EntityRepository(Stock)
class StockRepository extends Repository<Stock> {

}

export { StockRepository };