import request from "supertest";
import { app } from '../http';

import createConnection from "../database";

describe("Occupations", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    it("Should be able to create an occupation", async () => {
        const response = await request(app).post("/occupations/register")
        .send({
            id: "79b5a382-5125-4a0f-90f3-47e7cdc21824",
            name: "teste",
            commission_percentege: 0.15
        })

        expect(response.status).toBe(201);
    });

    it("Should be able to get all occupations", async () => {
        const response = await request(app).get("/occupations");

        expect(response.status).toBe(200);
    });

    it("Should be able to update an specific occupation", async () => {
        const response = await request(app).put("/occupations/79b5a382-5125-4a0f-90f3-47e7cdc21824")
            .send({
                name: "Teste123"
            });

        expect(response.status).toBe(200);
    });

    it("Should be able to delete manager", async () => {
        const response = await request(app).delete("/occupations/79b5a382-5125-4a0f-90f3-47e7cdc21824")

        expect(response.status).toBe(200);
    });
});