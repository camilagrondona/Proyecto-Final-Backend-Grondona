import cartsRepository from "../persistences/mongo/repositories/carts.repository.js"
import productsRepository from "../persistences/mongo/repositories/products.repository.js"
import error from "../errors/customErrors.js"

const createCart = async () => {
    return await cartsRepository.create()
}

const addProductToCart = async (cid, pid) => {
    return await cartsRepository.addProductToCart(cid, pid)
    /*Opción 2: 
        const cart = await cartsRepository.addProductToCart(cid, pid)
        return cart */
}

const updateQuantityProductInCart = async (cid, pid, quantity) => {
    return await cartsRepository.updateQuantityProductInCart(cid, pid, quantity)
}

const deleteProductInCart = async (cid, pid) => {
    return await cartsRepository.deleteProductInCart(cid, pid)
}

const getCartById = async (id) => {
    const cart = await cartsRepository.getById(id)
    if (!cart) throw error.notFoundError(`Cart id ${id} not found`)
    return cart
}

const deleteAllProductsInCart = async (cid) => {
    const cart = await cartsRepository.deleteAllProductsInCart(cid)
    if (!cart) throw error.notFoundError(`Cart id ${id} not found`)
    return cart
}

const purchaseCart = async (cid) => {
    const cart = await cartsRepository.getById(cid)
    // Chequeamos cuáles son los productos que quedan en el carrito (sin stock suficiente)
    if (!cart) throw error.notFoundError(`Cart id ${id} not found`)
    let total = 0 // total de productos en el carrito
    const products = [] // Acá colocamos los productos que no van a entrar en la compra para actualizar el carrito
    for (const product of cart.products) { // Se usa el for of y no el for each porque hay asincronismo y el forEach no respeta el tiempo de espera de los await 
        const prod = await productsRepository.getById(product.product) // La propiedad product es el id del producto que hemos almacenado
        if (prod.stock >= product.quantity) {
            total += prod.price * product.quantity
        }// acá la propiedad product hace referencia a cada producto del array. Si el stock de mi producto es igual o mayor a la cantidad de producto que tengo en mi carrito, se suma al total del carrito (el total que arranca en 0 arriba)
        else {
            products.push(product) // Si no tienen suficiente stock, se suman al array de productos del principio que empieza vacío 
        }
        await cartsRepository.updateCart(cid, products)// Actualizamos los productos que van a quedar en el carrito
    }
    return total
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