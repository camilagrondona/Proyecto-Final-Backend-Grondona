import { cartModel } from "../models/cart.model.js"

const getById = async (id) => {
    const cart = await cartModel.findById(id) // busca el carrito por su id
    return cart
}

const create = async (data) => {
    const cart = await cartModel.create(data) // data recibida del carrito nuevo
    return cart
}

const addProductToCart = async (cid, pid) => {
    const productInCart = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        {new:true}) // Buscamos si el producto está en el carrito y en caso positivo aumentamos la cantidad en 1 y actualizamos

    if (!productInCart) {
        return await cartModel.findOneAndUpdate(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } },
            {new: true}
        )
    } // Si no encuentra el producto en el carrito, ejecutamos un await y le pasamos el cart id y aumentamos el valor del producto en 1 (lo "pusheamos", lo agregamos por primera vez)

    return productInCart
}

const deleteProductInCart = async (cid, pid) => {
    const cart = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": -1 } },
        {new: true}
    )// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado y le disminuimos la cantidad en uno. 
    return cart
}

const updateQuantityProductInCart = async (cid, pid, quantity) => {
    const cart = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } },
        {new: true}
    )// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado. Seteamos la cantidad para que la reemplace por la quantity que se recibe en el body.
    return cart
}   

const deleteAllProductsInCart = async (cid) => {
    const cart = await cartModel.findByIdAndUpdate(
        cid,
        {$set: {products: []}},
        {new:true}
    ) // Buscamos el carrito y seteamos que el array de productos quede en 0 (vacío). 
    return cart
}

/* Explicación {$inc: {"products.$.product": -1}}:

1) $inc: Este es el operador de incremento. Se utiliza para incrementar el valor de un campo numérico en la cantidad especificada.

2) "products.$.quantity": 
products: es el nombre del array 

$:  es el operador de posición. Representa el primer elemento del array que coincide con la condición especificada en el filtro de la consulta. Básicamente, este operador selecciona el elemento correcto del array para la actualización.

quantity: es el campo del objeto dentro del array products cuyo valor queremos incrementar.
*/

const updateCart = async (cid, products) => {
    const cart = await cartModel.findByIdAndUpdate(cid, {$set: {products}}, {new:true}) // Los productos que no tengan stock suficiente para finalizar la compra se setean en el array de productos
    return cart
}

export default {
    getById,
    create,
    addProductToCart,
    deleteProductInCart,
    updateQuantityProductInCart, 
    deleteAllProductsInCart,
    updateCart
}