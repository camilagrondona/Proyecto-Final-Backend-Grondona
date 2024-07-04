import { Router } from "express"
import cartDao from "../dao/mongoDao/cart.dao.js"
import {authorization, passportCall} from "../middlewares/passport.middleware.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", authorization("user"), create) // Para crear un carrito tiene que tener nivel de usuario porque son ellos los que van a crearlos
router.get("/:cid", passportCall("jwt"), authorization("user"), readOne) // Para las demás funciones asociadas al carrito, el usuario debe estar logueado, por eso pasamos la passportCall. 
router.post("/:cid/product/:pid", passportCall("jwt"), authorization("user"), newProductToCart) 
router.delete ("/:cid/product/:pid", passportCall("jwt"), authorization("user"), destroy)
router.put ("/:cid", passportCall("jwt"), authorization("user"), updateOne)
router.put ("/:cid/product/:pid", passportCall("jwt"), authorization("user"), updateProductQuantityInCart)
router.delete("/:cid", passportCall("jwt"), authorization("user"), deleteAllProductsFromCart)

// POST: Callback create (para crear un nuevo carrito)

async function create(req, res) {
    try {
        const cart = await cartDao.create()
        return res.status(201).json({ status: "Success", payload: cart }) //201 es el estado de creación exitosa

    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// GET: Callback readOne (para obtener un carrito)

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

// POST: Callback newProductToCart (para agregar un producto al carrito)

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

// DELETE: Callback destroy (para quitar un producto del carrito)

async function destroy(req, res) {
    try {
        const {cid, pid} = req.params
        const cart = await cartDao.deleteProductInCart(cid, pid)
        if (cart.product == false) return res.status(404).json ({status: "Error", message: "Product Not Found"}) // Manejo del error del producto
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pase la validacion y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// PUT: Callback updateOne (para actualizar un carrito según su ID)

async function updateOne (req, res) {
    try {
        const {cid} = req.params
        const body = req.body // productos a actualizar en el carrito
        const cart = await cartDao.update(cid, body) // en el cuerpo del body recibimos la data
        if (!cart) return res.status(404).json ({status: "Error", message: "Not Found"}) // Manejo del error si no encuentra el carrito
        return res.status(200).json({ status: "Success", payload: cart }) 

    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// PUT: Callback updateProductQuantityInCart (actualiza la cantidad del producto en el cart)

async function updateProductQuantityInCart (req, res) {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const {quantity} = req.body // Desestructuramos del body la propiedad quantity
        const cart = await cartDao.updateQuantityProductInCart(cid, pid, quantity)
        if (cart.product == false) return res.status(404).json ({status: "Error", message: "Product Not Found"}) // Manejo del error del producto
        if (cart.cart == false) return res.status(404).json ({status: "Error", message: "Cart Not Found"}) // Manejo del error del carrito
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pasen ambas validaciones y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// DELETE : Callback deleteAllProductsFromCart (para borrar todos los productos del carrito)

async function deleteAllProductsFromCart (req, res) {
    try {
        const {cid} = req.params
        const cart = await cartDao.deleteAllProductsInCart(cid) 
        if (!cart) return res.status(404).json ({status: "Error", message: "Not Found"}) // Manejo del error si no encuentra el carrito
        return res.status(200).json({ status: "Success", payload: cart }) 

    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

export default router