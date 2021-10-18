import { Router } from "express";
import { CustomersController } from "./controllers/CustomersController";

import { ManagersController } from "./controllers/ManagersController";
import { OccupationsController } from "./controllers/OccupationsController";
import { ProductCategoriesController } from "./controllers/ProductCategoriesController";
import { ProductsController } from "./controllers/ProductsController";
import { WorkersController } from "./controllers/WorkersController";

const routes = Router();

// Controllers
const managersController = new ManagersController();
const occupationsController = new OccupationsController();
const workersController = new WorkersController();
const customersController = new CustomersController();
const productCategoriesController = new ProductCategoriesController();
const productsController = new ProductsController();

// Routes for Managers
routes.post("/managers/register", managersController.create);
routes.post("/managers/login", managersController.login);
routes.post("/managers/changepassword", managersController.changePassword);
routes.get("/managers/", managersController.getAllManagers);
routes.get("/managers/:id", managersController.getManagerById);
routes.put("/managers/:id", managersController.authenticateToken, managersController.updateManager);

// Routes for Occupations
routes.post("/occupations/register", occupationsController.create);
routes.get("/occupations/", occupationsController.getOccupations);
routes.put("/occupations/:id", occupationsController.updateOccupation);
routes.delete("/occupations/:id", occupationsController.removeOccupation);

// Routes for Workers
routes.post("/workers/register", workersController.create);
routes.post("/workers/login", workersController.login);
routes.get("/workers/", workersController.getWorkers);
routes.get("/workers/:id", /* workersController.authenticateToken, */ workersController.getWorkerById);
routes.put("/workers/:id", workersController.updateWorker);
routes.delete("/workers/:id", workersController.removeWorker);

// Routes for Customers
routes.post("/customers/register", customersController.create);
routes.get("/customers/:email", customersController.getByEmail);
routes.delete("/customers/:email", customersController.removeByEmail);

// Routes for Product Categories
routes.post("/productcategories/register", productCategoriesController.create);
routes.get("/productcategories/", productCategoriesController.getProductCategories);
routes.get("/productcategories/:id", productCategoriesController.getProductCategoryById);
routes.put("/productcategories/:id", productCategoriesController.updateProductCategory);
routes.delete("/productcategories/:id", productCategoriesController.removeProductCategory);

// Routes for Products
routes.post("/products/register", productsController.create);
routes.get("/products/", productsController.getProducts);
routes.get("/products/:id", productsController.getProductById);
routes.put("/products/:id", productsController.updateProduct);
routes.delete("/products/:id", productsController.removeProduct);

export { routes };