import supertest from "supertest"
import envConfig from "../src/config/env.config.js"
import { expect } from "chai"
import mongoose from "mongoose"

mongoose.connect(envConfig.MONGO_URL)

const requester = supertest(`http://localhost:${envConfig.PORT}`)

describe("Cart Test", () => {
    let cookie
    let cartId
    let productId

    before(async () => {
        const loginUser = {
            email: "useradmin2@test.com",
            password: "12345",
        }

        const { _body, headers } = await requester
            .post("/api/session/login")
            .send(loginUser)

        const cookieResult = headers["set-cookie"][0]
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        }

        cartId = _body.payload.cart

        // Creamos un producto para agregar al carrito
        const newProduct = {
            title: "Prueba",
            description: "Esta es una prueba",
            price: 35000,
            thumbnail: ["http://www.ropacanchera.com/prueba"],
            code: "CGTP1250",
            category: "Pruebas",
            stock: 5,
        }

        const productResponse = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", `${cookie.name}=${cookie.value}`)

        productId = productResponse._body.payload._id
    })

    it("[POST] /api/carts/:cid/product/:pid => Endpoint to add product to cart", async () => {

        const { status, _body, ok } = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", `${cookie.name}=${cookie.value}`)

        expect(status).to.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.payload.products).to.be.an("array")

    })

    it("[GET] /api/carts/:cid => Endpoint to return a cart", async () => {

        const { status, _body, ok } = await requester
            .get(`/api/carts/${cartId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`])

        expect(status).to.be.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.status).to.be.equal("Success")
        expect(_body.payload.products).to.be.an("array")
        expect(_body.payload._id).to.be.an("string")
        expect(_body.payload).to.be.an("object")
    })

    it("[DELETE] /api/carts/:cid => Endpoint to delete a cart", async () => {

        const { status, _body, ok } = await requester
            .delete(`/api/carts/${cartId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`])

        expect(status).to.be.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.status).to.be.equal("Success")
        expect(_body.payload).to.be.an("object")
        expect(_body.payload._id).to.be.an("string")
        expect(_body.payload.products).to.be.an("array")
    })

    after(async () => {
        mongoose.disconnect()
    })
})