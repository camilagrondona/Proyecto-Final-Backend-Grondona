import mongoose from "mongoose"
import envConfig from "../src/config/env.config.js"
import userRepository from "../src/persistences/mongo/repositories/user.repository.js"
import { expect } from "chai"

mongoose.connect(envConfig.MONGO_URL)

describe("User Repository Test", () => { // Esta función ejecuta todos los tests

    // before(() => {
    //     console.log("Function executed before all tests") // Ejemplo de uso: si queremos que el test nos devuelva un array vacío de usuarios, para asegurar que pase, podemos en el before utilizar un delete many. 
    // })

    // beforeEach(() => {
    //     console.log("Function executed before each test") // Ejemplo: limpieza de caché
    // })

    it("Get all users", async () => {
        const users = await userRepository.getAll()
        expect(users).to.be.an("array")
    })

    let userId
    let userEmail

    it("Create user", async () => {
        const newUser = {
            first_name: 'User',
            last_name: 'Test',
            email: 'user@test.com',
            password: '123',
            age: 20
        }

        const user = await userRepository.create(newUser)
        userId = user._id
        userEmail = user.email

        expect(user.first_name).to.equal("User")
        expect(user.last_name).to.equal("Test")
        expect(user.email).to.equal("user@test.com")
        expect(user.password).to.equal("123")
        expect(user.age).to.equal(20)
        expect(user.role).to.equal("user")
    })

    it("Get user by id", async () => {
        const user = await userRepository.getById(userId)
        expect(user).to.be.an("object")
        expect(user.email).to.equal("user@test.com")
        expect(user.password).to.not.equal("asfg")
        expect(user.password).to.not.an("number")
    })

    it("Get user by email", async () => {
        const user = await userRepository.getByEmail(userEmail)
        expect(user).to.be.an("object")
        expect(user.email).to.equal("user@test.com")
        expect(user.password).to.not.equal("asfg")
        expect(user.password).to.not.an("number")
    })

    it("Update user", async () => {
        const user = await userRepository.update(userId, {
            first_name: "User Updated",
            last_name: "Updated",
            age: 50
        })
        expect(user).to.be.an("object")
        expect(user.first_name).to.equal("User Updated")
        expect(user.last_name).to.equal("Updated")
        expect(user.email).to.not.equal(20)
    })

    it("Delete user by id", async () => {
        await userRepository.deleteOne(userId)
        const user = await userRepository.getById(userId)
        expect(user).to.be.null
    })

    after(async () => {
        console.log("Function executed after all tests are completed")
        mongoose.disconnect()
    })

    // afterEach(() => {
    //     console.log("Function executed after each test") 
    // })
})