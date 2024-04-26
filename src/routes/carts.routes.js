import { Router } from "express";
import { getCarts, createCart, getCartById, addProductToCart } from "../managers/cartManager.js" // Importamos los métodos del cartManager

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", create)
router.get("/", read)
router.get("/:cid", readOne) // parámetro cid (cart ID)
router.post("/:cid/product/:pid", newProductToCart)

// Callback create (para crear un nuevo carrito)

async function create(req, res) {
    try {
        const cart = await createCart()
        return res.json({ status: 201, response: cart }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback read (para obtener los carritos)

async function read(req, res) {
    try {
        let cart = await getCarts()
        return res.json({ status: 200, response: cart })
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}
// Callback readOne (para buscar un producto según su ID y leer los productos)

async function readOne(req, res) {
    try {
        const { cid } = req.params
        const cart = await getCartById(+cid) // Transforma en número el dato que estamos recibiendo. Es como el parseInt
        return res.json({ status: 200, response: cart })
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback newProductToCart (para agregar un producto al carrito)

async function newProductToCart(req, res) {
    try {
        const { cid, pid } = req.params
        const cart = await addProductToCart(cid, pid)
        return res.json({ status: 201, response: cart }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

export default router