import request from "supertest";
import { app } from '../http';

import createConnection from "../database";

describe("Managers", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    it("Should be able to create a manager", async () => {
        const response = await request(app).post("/managers/register")
        .send({
            name: "teste",
            email: "teste@teste.com",
            phone: "3899892577",
            cpf: "138.755.401-49",
            password: "teste"
        });

        expect(response.status).toBe(201);
    })
});