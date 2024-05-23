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

/* Explicación {$inc: {"products.$.product": -1}}:

1) $inc: Este es el operador de incremento. Se utiliza para incrementar el valor de un campo numérico en la cantidad especificada.

2) "products.$.quantity": 
products: es el nombre del array 

$:  es el operador de posición. Representa el primer elemento del array que coincide con la condición especificada en el filtro de la consulta. Básicamente, este operador selecciona el elemento correcto del array para la actualización.

quantity: es el campo del objeto dentro del array products cuyo valor queremos incrementar.
*/

const update = async (cid, data) => {
    await cartModel.updateOne({ _id: cid }, { $set: { products: [] } }) // Primero buscamos el carrito por su ID, y seteamos la información de productos y le asignamos un array vacío
    await cartModel.updateOne({ _id: cid }, { $set: { products: data } }) // luego lo vamos a actualizar con la data (nuevo array de productos que va a recibir)
    const cart = await cartModel.findById(cid) // Traemos el carrito buscándolo por su ID
    return cart // retornamos el carrito con la información actualizada
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