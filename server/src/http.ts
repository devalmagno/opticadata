import express from "express";
import { createServer } from "http";

import createConnection from "./database";
import { routes } from "./routes";

createConnection();

const app = express();
const http = createServer(app);

app.use(express.json());
app.use(routes);

export { http, app };
