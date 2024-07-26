import cartsServices from "../services/carts.services.js"
import ticketServices from "../services/ticket.services.js"

const createCart = async (req, res) => {
    try {
        const cart = await cartsServices.createCart()
        return res.status(201).json({ status: "Success", payload: cart }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const cart = await cartsServices.addProductToCart(cid, pid)
        return res.status(200).json({ status: "Success", payload: cart }) 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const updateQuantityProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const {quantity} = req.body // Desestructuramos del body la propiedad quantity
        const cart = await cartsServices.updateQuantityProductInCart(cid, pid, quantity)
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pasen ambas validaciones y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const deleteProductInCart = async (req, res) => {
    try {
        const {cid, pid} = req.params
        const cart = await cartsServices.deleteProductInCart(cid, pid)
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pase la validacion y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const getCartById = async (req, res) => {
    try {
        const { cid } = req.params // Se recibe por parámetro el cart ID
        const cart = await cartsServices.getCartById(cid) 
        if (!cart) return res.status(404).json ({status: "Error", message: "Not Found"}) // Manejo del error
        return res.status(200).json({ status: "Success", payload: cart })
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const deleteAllProductsInCart = async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartsServices.deleteAllProductsInCart(cid) 
        if (!cart) return res.status(404).json ({status: "Error", message: "Not Found"}) // Manejo del error si no encuentra el carrito
        return res.status(200).json({ status: "Success", payload: cart }) 

    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const purchaseCart = async (req, res) => {
    try {
        const {cid} = req.params // Desestructuramos el cart id de params
        const cart = await cartsServices.getCartById(cid)
        if (!cart) return res.status(404).json ({status: "Error", message: `No se encontró el carrito con el id ${cid}`}) // Manejo del error si no encuentra el carrito
        const total = await cartsServices.purchaseCart(cid) // Obtenemos el total del carrito 
        // Creamos el ticket 
        const ticket = await ticketServices.createTicket(req.user.email, total) // Extreamos el email del usuario logueado del token 
        return res.status(200).json({ status: "Success", payload: ticket }) 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

export default {
    createCart,
    addProductToCart,
    updateQuantityProductInCart,
    deleteProductInCart,
    getCartById,
    deleteAllProductsInCart,
    purchaseCart
}