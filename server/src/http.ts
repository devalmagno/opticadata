import express from "express";
import { createServer } from "http";
import cors from "cors";

import createConnection from "./database";
import { routes } from "./routes";

createConnection();

const app = express();
const http = createServer(app);

app.use(cors());
app.use(express.json());
app.use(routes);

export { http, app };
