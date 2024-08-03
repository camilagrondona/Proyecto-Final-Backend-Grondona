import { request, response } from "express"
import productsServices from "../services/products.services.js"
import cartsServices from "../services/carts.services.js"
import error from "../errors/customErrors.js"

export const checkProductAndCart = async (req = request, res = response, next) => {
    const {cid, pid} = req.params // desestructuramos de los params el cart ID y el product ID 
    const product = await productsServices.getById(pid)
    const cart = await cartsServices.getCartById(cid)

    if (!product) throw error.notFoundError(`No se encontró el producto con el id ${pid}`)// Manejo del error del producto
    if (!cart) throw error.notFoundError(`No se encontró el carrito con el id ${cid}`) // Manejo del error del carrito

    next() // Si pasa las verificaciones, continúa la función
}