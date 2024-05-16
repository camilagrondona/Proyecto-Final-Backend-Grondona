import { Router } from "express"
import cartDao from "../dao/mongoDao/cart.dao.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", create)
router.get("/:cid", readOne) // parámetro cid (cart ID)
router.post("/:cid/product/:pid", newProductToCart)

// Callback create (para crear un nuevo carrito)

async function create(req, res) {
    try {
        const cart = await cartDao.create()
        return res.status(201).json({ status: "Success", payload: cart }) //201 es el estado de creación exitosa

    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback readOne (para buscar un producto según su ID y leer los productos)

async function readOne(req, res) {
    try {
        const { cid } = req.params // Se recibe por parámetro el cart ID
        const cart = await cartDao.getById(cid) 
        if (!cart) return res.status(404).json ({status: "Error", message: "Not Found"}) // Manejo del error
        return res.status(200).json({ status: "Success", payload: cart })
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback newProductToCart (para agregar un producto al carrito)

async function newProductToCart(req, res) {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const cart = await cartDao.addProductToCart(cid, pid)
        if (cart.product == false) return res.status(404).json ({status: "Error", message: "Product Not Found"}) // Manejo del error del producto
        if (cart.cart == false) return res.status(404).json ({status: "Error", message: "Cart Not Found"}) // Manejo del error del carrito
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pasen ambas validaciones y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

export default router