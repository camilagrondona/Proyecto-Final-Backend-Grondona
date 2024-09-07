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

        const { headers } = await requester
            .post("/api/session/login")
            .send(loginUser)

        const cookieResult = headers["set-cookie"][0]
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        }

        // Obtenemos los detalles del usuario, incluyendo el ID del carrito
        const { _body } = await requester
            .get("/api/users/current")
            .set("Cookie", `${cookie.name}=${cookie.value}`)

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
        expect(_body.payload).to.have.property("_id", cartId)
        expect(_body.payload.products).to.be.an("array")

        // Verificamos que el producto fue agregado correctamente al carrito
        const productInCart = _body.payload.products.find(
            (p) => p.product._id === productId
        );

        expect(productInCart).to.exist
    })

    after(async () => {
        mongoose.disconnect()
    })
})