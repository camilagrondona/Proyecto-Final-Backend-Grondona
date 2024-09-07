import { expect } from "chai"
import supertest from "supertest"
import mongoose from "mongoose"
import envConfig from "../src/config/env.config.js"
import { userModel } from "../src/persistences/mongo/models/user.model.js"

mongoose.connect(envConfig.MONGO_URL)

const requester = supertest(`http://localhost:${envConfig.PORT}`)

describe("Session Test", () => {

    it("[POST] /api/session/register => Endpoint to register a new user", async () => {
        const newUser = {
            first_name: "User test2",
            last_name: "Test2",
            email: "user-test2@test.com",
            password: "123",
            age: 20,
        }

        const { status, _body, ok } = await requester.post("/api/session/register").send(newUser) // Enviamos al cuerpo del body el new user
        expect(status).to.be.equal(201)
        expect(ok).to.be.equal(true)
        expect(newUser).to.be.an("object")
        expect(newUser.first_name).to.equal("User test2")
        expect(newUser.last_name).to.equal("Test2")
        expect(newUser.email).to.equal("user-test2@test.com")
        expect(newUser.password).to.equal("123")
        expect(newUser.age).to.equal(20)
    })

    let cookie

    it("[POST] /api/session/login => Endpoint user login", async () => {
        const loginUser = {
            email: "user-test2@test.com",
            password: "123",
        }

        const { status, _body, ok, headers } = await requester.post("/api/session/login").send(loginUser)
        const cookieResult = headers["set-cookie"][0] // accedemos al array set cookie en la posición 0 (string token dentro de set-cookie)
        cookie = {
            name: cookieResult.split("=")[0], // Le pedimos que separe el string después del = en un array con dos posiciones(en consola se muestra token=.... el token en este caso es el name y el valor queda separado después del igual). En la posicion 0 está el 1er valor que es token
            value: cookieResult.split("=")[1]
        }

        expect(ok).to.be.equal(true)
        expect(status).to.be.equal(200)
        expect(_body.payload.first_name).to.be.equal("User test2")
        expect(_body.payload.email).to.be.equal("user-test2@test.com")
        expect(_body.payload.role).to.be.equal("user")

    })

    it("[GET] /api/session/current => Endpoint that shows the current user's info", async () => {
        const { status, _body, ok } = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`])

        expect(ok).to.be.equal(true)
        expect(status).to.be.equal(200)
        expect(_body.payload.email).to.be.equal("user-test2@test.com")
        expect(_body.payload.role).to.be.equal("user")
    })

    after(async () => {
        await userModel.deleteOne({ email: "user-test2@test.com" })
        mongoose.disconnect()
    })
})
