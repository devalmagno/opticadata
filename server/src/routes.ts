import { Router } from "express";

import { CustomersController } from "./controllers/CustomersController";
import { ManagersController } from "./controllers/ManagersController";
import { OccupationsController } from "./controllers/OccupationsController";
import { OrdersController } from "./controllers/OrdersController";
import { ProductCategoriesController } from "./controllers/ProductCategoriesController";
import { ProductsController } from "./controllers/ProductsController";
import { ProvidersControllers } from "./controllers/ProvidersController";
import { StockController } from "./controllers/StockController";
import { WorkersController } from "./controllers/WorkersController";

const routes = Router();

// Controllers
const managersController = new ManagersController();
const occupationsController = new OccupationsController();
const workersController = new WorkersController();
const customersController = new CustomersController();
const productCategoriesController = new ProductCategoriesController();
const productsController = new ProductsController();
const providersController = new ProvidersControllers();
const stockController = new StockController();
const ordersController = new OrdersController();

// Routes for Managers
routes.post("/managers/register", managersController.create);
routes.post("/managers/login", managersController.login);
routes.get("/managers/", managersController.getAllManagers);
routes.get("/managers/:id", managersController.getManagerById);
routes.put("/managers/:id", managersController.authenticateToken, managersController.updateManager);
routes.put("/managers/password/:id", managersController.changePassword);

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
routes.put("/workers/password/:id", workersController.changePassword);
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

// Routes for Providers
routes.post("/providers", providersController.create);
routes.get("/providers", providersController.getProviders);
routes.put("/providers/:id", providersController.updateProvider);
routes.delete("/providers/:id", providersController.removeProvider);

// Routes for Stock
routes.post("/stock", stockController.create);
routes.get("/stock", stockController.getStocks);
routes.get("/stock/product", stockController.getStocksByProduct);

// Routes for Orders
routes.post("/orders", ordersController.create);
routes.get("/orders", ordersController.getOrders);
routes.get("/orders/:id", ordersController.getOrdersById);
routes.delete("/orders/:id", ordersController.removeOrder);

export { routes };