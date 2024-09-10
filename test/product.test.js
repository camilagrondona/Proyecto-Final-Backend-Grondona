import supertest from "supertest"
import envConfig from "../src/config/env.config.js"
import { expect } from "chai"
import mongoose from "mongoose"

mongoose.connect(envConfig.MONGO_URL)

const requester = supertest(`http://localhost:${envConfig.PORT}`)

describe("Product Test", () => {
    let cookie
    before(async () => {
        const loginUser = {
            email: "useradmin2@test.com",
            password: "12345"
        }

        const { headers } = await requester.post("/api/session/login").send(loginUser)
        const cookieResult = headers["set-cookie"][0]
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }
    })

    let productId

    it("[POST] /api/products => Endpoint to create a new product", async () => {
        const newProduct = {
            "title": "Prueba",
            "description": "Esta es una prueba",
            "price": 35000,
            "thumbnail": ["http://www.ropacanchera.com/prueba"],
            "code": "CGTP1250",
            "category": "Pruebas",
            "stock": 5
        }

        const { status, _body, ok } = await requester.post("/api/products")
        .send(newProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        productId = _body.payload._id

        expect(status).to.be.equal(201)
        expect(ok).to.be.equal(true)
        expect(_body.payload.title).to.be.equal("Prueba")
        expect(_body.payload.description).to.be.equal("Esta es una prueba")
        expect(_body.payload.price).to.be.equal(35000)
        expect(_body.payload.thumbnail).to.deep.equal(["http://www.ropacanchera.com/prueba"])
        expect(_body.payload.code).to.be.equal("CGTP1250")
        expect(_body.payload.category).to.be.equal("Pruebas")
        expect(_body.payload.stock).to.be.equal(5)
    })

    it("[GET] /api/products/:pid => Endpoint to get a product by ID", async () => {

        const { status, _body, ok } = await requester.get(`/api/products/${productId}`)

        expect(status).to.be.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.payload.title).to.be.equal("Prueba")
        expect(_body.payload.description).to.be.equal("Esta es una prueba")
        expect(_body.payload.price).to.be.equal(35000)
        expect(_body.payload.thumbnail).to.deep.equal(["http://www.ropacanchera.com/prueba"])
        expect(_body.payload.category).to.be.equal("Pruebas")
        expect(_body.payload.stock).to.be.equal(5)
    })

    it("[GET] /api/products => Endpoint to get all products", async () => {

        const { status, _body, ok } = await requester.get("/api/products")
    
        expect(status).to.be.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.products.docs).to.be.an("array") // Es docs porque tenemos los productos paginados dentro de un array llamado docs
        expect(_body.products.totalDocs).to.be.a("number")
        expect(_body.products.limit).to.be.a("number")
        expect(_body.products.limit).to.equal(10) // Asegúrate de comparar valores numéricos con .equal
        expect(_body.products.totalPages).to.be.a("number")
        expect(_body.products.page).to.be.a("number")
        expect(_body.products.pagingCounter).to.be.a("number")
        expect(_body.products.hasPrevPage).to.be.a("boolean")
        expect(_body.products.hasNextPage).to.be.a("boolean")
        expect(_body.products.prevPage).to.satisfy((value) => value === null || typeof value === "number") // Validar que prevPage sea null o un número
        expect(_body.products.nextPage).to.satisfy((value) => value === undefined || value === null || typeof value === "number") // Validar que nextPage sea undefined, null o un número
    })

    it("[PUT] /api/products/:pid => Endpoint to update a product by ID", async () => {
        const updatedData = {
            title: "Test updated",
            description: "Test product updated"
        }

        const { status, _body, ok } = await requester.put(`/api/products/${productId}`).send(updatedData).set("Cookie", [`${cookie.name}=${cookie.value}`])
    
        expect(status).to.be.equal(200)
        expect(ok).to.be.equal(true)
        expect(_body.payload.title).to.be.equal("Test updated")
        expect(_body.payload.description).to.be.equal("Test product updated")
    })   

        it("[DELETE] /api/products/:pid => Endpoint to delete a product", async () => {

            const { status, _body, ok } = await requester.delete(`/api/products/${productId}`).set("Cookie", [`${cookie.name}=${cookie.value}`])

            expect(status).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body.payload).to.be.equal("Product deleted")
    })

    after(async () => {
        mongoose.disconnect()
    })
})