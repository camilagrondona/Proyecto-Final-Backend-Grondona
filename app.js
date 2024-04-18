import express from "express"  

import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "./data/fs/productManager.js" // Importamos los métodos del productManager 

const app = express() // Creamos la app de express ejecutando la función. Se creó el servidor.

// Inicializamos la app de express configurando: 

// 1) El puerto donde se inicializa el servidor

const port = 8080

// 2) Función ready, para que cuando el servidor esté inicializado nos muestre en consola el siguiente mensaje: 

const ready = console.log("Server ready on port " + port)

// Para inicializar el servidor, necesito escuchar el puerto 8080 y luego de que se levantó ejecutar la callback ready 

app.listen(port, ready) // Está inicializado pero aún no está funcionando; para ello, hay que correr en la consola el comando "npm run dev"

// Configuramos el servidor con determinadas funcionalidades:

app.use(express.urlencoded({ extended: true })) // Para leer querys y params

// Configuración de solicitudes / peticiones

app.get("/", index)
app.get("/products", read)
app.get("/products/:pid", readOne) // parámetro pid (product ID)

//Index

function index(req, res) {
    try {
        const message = "Welcome to Coder-Server"
        return res.json({ status: 200, response: message }) // Respuesta al cliente. Tenemos 3 formas de enviarle información: método send, render o json. Por eso elegimos el json en este caso. 
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
            const error = new Error("Not found") // se crea con el mensaje de error
            error.status = 404 // se configura el estado 
            throw error // se arroja el error para manejarlo con el catch
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" }) // dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
    }
}