import cartsServices from "../services/carts.services.js"
import ticketServices from "../services/ticket.services.js"
import { logger } from "../utils/logger.js"

const createCart = async (req, res, next) => {
    try {
        const cart = await cartsServices.createCart()
        return res.status(201).json({ status: "Success", payload: cart }) //201 es el estado de creación exitosa
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const addProductToCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const cart = await cartsServices.addProductToCart(cid, pid)
        return res.status(200).json({ status: "Success", payload: cart })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const updateQuantityProductInCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params // se reciben por parámetro el cart ID y el product ID
        const { quantity } = req.body // Desestructuramos del body la propiedad quantity
        const cart = await cartsServices.updateQuantityProductInCart(cid, pid, quantity)
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pasen ambas validaciones y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const deleteProductInCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartsServices.deleteProductInCart(cid, pid)
        return res.status(200).json({ status: "Success", payload: cart }) // En caso de que se pase la validacion y esté todo correcto, devolvemos el carrito 
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const getCartById = async (req, res, next) => {
    try {
        const { cid } = req.params // Se recibe por parámetro el cart ID
        const cart = await cartsServices.getCartById(cid)

        return res.status(200).json({ status: "Success", payload: cart })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const deleteAllProductsInCart = async (req, res, next) => {
    try {
        const { cid } = req.params
        const cart = await cartsServices.deleteAllProductsInCart(cid)

        return res.status(200).json({ status: "Success", payload: cart })

    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const purchaseCart = async (req, res, next) => {
    try {
        const { cid } = req.params // Desestructuramos el cart id de params
        await cartsServices.getCartById(cid)

        const total = await cartsServices.purchaseCart(cid) // Obtenemos el total del carrito 
        // Creamos el ticket 
        const ticket = await ticketServices.createTicket(req.user.email, total) // Extreamos el email del usuario logueado del token 
        return res.status(200).json({ status: "Success", payload: ticket })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
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