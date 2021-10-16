import { Router } from "express";
import { CustomersController } from "./controllers/CustomersController";

import { ManagersController } from "./controllers/ManagersController";
import { ProductCategoriesController } from "./controllers/ProductCategoriesController";
import { ProductsController } from "./controllers/ProductsController";
import { WorkersController } from "./controllers/WorkersController";

const routes = Router();

// Controllers
const managersController = new ManagersController();
const workersController = new WorkersController();
const customersController = new CustomersController();
const productCategoriesController = new ProductCategoriesController();
const productsController = new ProductsController();

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

// Routes for Product Categories
routes.post("/productcategories/register", productCategoriesController.create);
routes.get("/productCategories/", productCategoriesController.getProductCategories);
routes.get("/productCategories/:id", productCategoriesController.getProductCategoryById);
routes.put("/productCategories/:id", productCategoriesController.updateProductCategory);
routes.delete("/productCategories/:id", productCategoriesController.removeProductCategory);

// Routes for Products
routes.post("/products/register", productsController.create);
routes.get("/products/", productsController.getProducts);
routes.get("/products/:id", productsController.getProductById);
routes.put("/products/:id", productsController.updateProduct);
routes.delete("/products/:id", productsController.removeProduct);

export { routes };