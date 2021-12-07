import request from "supertest";
import { app } from '../http';

import createConnection from "../database";

describe("Workers", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    it("Should be able to create a worker", async () => {
        const response = await request(app).post("/workers/register")
        .send({
            id: "79b5a382-5125-4a0f-90f3-47e7cdc21824",
            name: "teste",
            email: "teste123@teste.com",
            phone: "38998925778",
            cpf: "138.765.401-49",
            occupation_id: "79b5a382-5125-4a0f-90f3-47e7cdc21824"
        })

        console.log(response.body);

        expect(response.status).toBe(201);
    });

    it("Should be able to get all workers", async () => {
        const response = await request(app).get("/workers");

        expect(response.status).toBe(200);
    });

    it("Should be able to make login", async () => {
        const response = await request(app).post("/workers/login")
            .send({
                cpf: "138.765.401-49",
                password: "admin"
            });

        expect(response.status).toBe(200);
    });

    it("Should be able to update worker", async () => {
        const response = await request(app).put("/workers/79b5a382-5125-4a0f-90f3-47e7cdc21824")
            .send({
                name: "Mavi"
            });

        expect(response.status).toBe(200);
    });

    it("Should be able to update worker password", async () => {
        const response = await request(app).put("/workers/password/79b5a382-5125-4a0f-90f3-47e7cdc21824")
            .send({
                password: "admin",
                newPassword: "qualquerCoisa"
            });

        expect(response.status).toBe(200);
    });

    it("Should be able to delete worker", async () => {
        const response = await request(app).delete("/workers/79b5a382-5125-4a0f-90f3-47e7cdc21824")

        expect(response.status).toBe(200);
    });
});