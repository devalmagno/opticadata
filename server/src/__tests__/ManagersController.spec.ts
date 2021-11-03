import { app } from "../http";
import request from "supertest";

describe("Manager Controller", () => {

    it("Should be able to create a new manager", async () => {
        const response = await request(app).post("/managers/register")
        .send({
            name: "John Doe",
            email: "teste@teste.com",
            phone: "38998543245",
            cpf: "000.000.000-75",
            password: "teste"
        });

        console.log(response);
    })
})