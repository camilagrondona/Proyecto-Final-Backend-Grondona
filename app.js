import express from "express"
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "./data/fs/productManager.js"

const app = express()

const port = 8080

const ready = console.log("Server ready on port " + port)

app.listen(port, ready)

app.use(express.urlencoded({ extended: true }))

//Solicitudes / peticiones

app.get("/", index)
app.get("/products", read)
app.get("/products/:pid", readOne) // parámetro pid (product ID)

//Index

function index(req, res) {
    try {
        const message = "Welcome to Coder-Server"
        return res.json({ status: 200, response: message })
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, response: error.message })
    }
}

// Callback read (para leer todos los productos) - Query limit

async function read(req, res) {
    try {
        const limit = req.query.limit // Obtenemos el parámetro de consulta "limit"
        let all = await getProducts()
        // Si se proporciona el parámetro "limit", limitamos la cantidad de productos
        if (limit) {
            all = all.slice(0, parseInt(limit)) // Convertimos el límite a número y obtenemos los productos indicados según ese límite
        }
        if (all.length > 0) {
            return res.json({ status: 200, response: all })
        } else {
            return res.json({ status: 404, response: "Not found" })
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, response: error.message })
    }
}

// Callback readOne (para leer un producto según su ID)

async function readOne(req, res) {
    try {
        const { pid } = req.params
        const one = await getProductById(pid)
        if (one) {
            return res.json({ status: 200, response: one })
        } else {
            const error = new Error("Not found")
            error.status = 404
            throw error
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}