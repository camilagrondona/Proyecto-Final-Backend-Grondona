import { cartModel } from "../models/cart.model.js"
import { productModel } from "../models/product.model.js"

const getById = async (id) => {
    const cart = await cartModel.findById(id) // busca el carrito por su id
    return cart
}

const create = async (data) => {
    const cart = await cartModel.create(data) // data recibida del carrito nuevo
    return cart
}

const addProductToCart = async (cid, pid) => {
    const product = await productModel.findById(pid) // Buscamos el producto por productModel
    if (!product) return {product: false} // Manejo del error (devolvemos un objeto que especifica que el false pertenece en este caso al producto)

    await cartModel.findByIdAndUpdate(cid, {$push: {products: product}}) // Busca el carrito por su ID y le agrega los productos (push propiedad de mongoose). En este punto, no se está devolviendo el carrito actualizado. 

    const cart = await cartModel.findById(cid) // Como aún no lo devuelve actualizado, lo volvemos a llamar y lo guardamos en una constante
    if(!cart) return {cart: false} // Manejo del error (en caso de que no exista, que no lo encuentre correctamente, devuelve un false)

    return cart // Y acá lo retornamos actualizado
}

export default {
    getById,
    create,
    addProductToCart
}