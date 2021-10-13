import { EntityRepository, Repository } from 'typeorm';

import { Customer} from '../entities/Customer';

@EntityRepository(Customer)
class CustomersRepository extends Repository<Customer> {

}

export { CustomersRepository };