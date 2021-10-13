import { Router } from "express";
import { CustomersController } from "./controllers/CustomersController";

import { ManagersController } from "./controllers/ManagersController";
import { WorkersController } from "./controllers/WorkersController";

const routes = Router();

// Controllers
const managersController = new ManagersController();
const workersController = new WorkersController();
const customersController = new CustomersController();

// Routes for Managers
routes.post("/managers/register", managersController.create);
routes.post("/managers/login", managersController.login);
routes.get("/managers/:cpf", managersController.authenticateToken, managersController.getManagerByCpf);

// Routes for Workers
routes.post("/workers/register", workersController.create);
routes.post("/workers/login", workersController.login);
routes.get("/workers/:cpf", workersController.authenticateToken, workersController.getWorkerByCpf);
routes.delete("/workers/:cpf", managersController.authenticateToken, workersController.removeWorker);

// Routes for Customers
routes.post("/customers/register", customersController.create);
routes.get("/customers/:email", customersController.getByEmail);
routes.delete("/customers/:email", customersController.removeByEmail);

export { routes };