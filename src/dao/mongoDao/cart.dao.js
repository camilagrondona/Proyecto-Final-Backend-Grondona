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

const update = async (query, data) => {
    return await cartModel.findOneAndUpdate(query, data, {new: true}) // La propiedad new true nos devuelve la info actualizada
}

const addProductToCart = async (cid, pid) => {
    const product = await productModel.findById(pid) // Buscamos el producto por productModel
    if (!product) return { product: false } // Manejo del error (devolvemos un objeto que especifica que no está encontrando el id del producto)

    const cart = await cartModel.findById(cid) // Buscamos el cart por cartModel
    if (!cart) return { cart: false } // Manejo del error (devolvemos un objeto que especifica que no está encontrando el id del cart)

    const productInCart = await cartModel.findOneAndUpdate({ _id: cid, "products.product": pid }, { $inc: { "products.$.quantity": 1 } }) // Buscamos si el producto está en el carrito y en caso positivo aumentamos la cantidad en 1 y actualizamos

    if (!productInCart) {
        await cartModel.updateOne({ _id: cid }, { $push: { products: { product: pid, quantity: 1 } } })
    } // Si no encuentra el producto en el carrito, ejecutamos un await y le pasamos el cart id y aumentamos el valor del producto en 1 (lo "pusheamos", lo agregamos por primera vez)

    const cartUpdated = await cartModel.findById(cid) // consultamos el carrito actualizado

    return cartUpdated // Y acá lo retornamos 
}

const deleteProductInCart = async (cid, pid) => {
    const product = await productModel.findById(pid) // Buscamos el producto por productModel según su ID
    if (!product) return { product: false } // Manejo del error (devolvemos un objeto que especifica que el false pertenece en este caso al producto)

    const cart = await cartModel.findOneAndUpdate({ _id: cid, "products.product": pid }, { $inc: { "products.$.quantity": -1 } })// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado y le disminuimos la cantidad en uno. 
    if (!cart) return { cart: false } // Manejo del error (en caso de que no exista, que no lo encuentre correctamente, devuelve un false)

    const cartUpdated = await cartModel.findById(cid) // consultamos el carrito actualizado

    return cartUpdated // Y acá lo retornamos 

}

const updateQuantityProductInCart = async (cid, pid, quantity) => {
    const product = await productModel.findById(pid) // Buscamos el producto por productModel según su ID
    if (!product) return { product: false } // Manejo del error (devolvemos un objeto que especifica que el false pertenece en este caso al producto)

    const cart = await cartModel.findOneAndUpdate({ _id: cid, "products.product": pid }, { $set: { "products.$.quantity": quantity } })// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado. Seteamos la cantidad para que la reemplace por la quantity que se recibe en el body.

    if (!cart) return { cart: false } // Manejo del error (devolvemos un objeto que especifica que no está encontrando el id del cart)

    const cartUpdated = await cartModel.findById(cid) // consultamos el carrito actualizado

    return cartUpdated // Y acá lo retornamos 
}   

const deleteAllProductsInCart = async (cid) => {
    const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products: []}}) // Buscamos el carrito y seteamos que el array de productos quede en 0 (vacío). 
    const cartUpdated = await cartModel.findById(cid) // consultamos el carrito actualizado
    return cartUpdated // Y lo retornamos 
}

export default {
    getById,
    create,
    addProductToCart,
    deleteProductInCart,
    update,
    updateQuantityProductInCart, 
    deleteAllProductsInCart
}