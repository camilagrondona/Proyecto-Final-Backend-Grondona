import cartDao from "../dao/mongoDao/cart.dao.js"
import productDao from "../dao/mongoDao/product.dao.js"

const createCart = async () => {
    return await cartDao.create()
}

const addProductToCart = async (cid, pid) => {
    await checkProductAndCart(cid, pid) // No tiene retorno porque ya de por sí la función tiene su retorno, entonces no es necesario 

    const productInCart = await cartDao.update({ _id: cid, "products.product": pid }, { $inc: { "products.$.quantity": 1 } })// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado y le aumentamos la cantidad en uno. 

    if (!productInCart) {
        await cartDao.update({ _id: cid }, { $push: { products: { product: pid, quantity: 1 } } })
    } // Si no encuentra el producto en el carrito, ejecutamos un await y le pasamos el cart id y aumentamos el valor del producto en 1 (lo "pusheamos", lo agregamos por primera vez)
    return productInCart
}

/* Explicación {$inc: {"products.$.product": -1}}:

1) $inc: Este es el operador de incremento. Se utiliza para incrementar el valor de un campo numérico en la cantidad especificada.

2) "products.$.quantity": 
products: es el nombre del array 

$:  es el operador de posición. Representa el primer elemento del array que coincide con la condición especificada en el filtro de la consulta. Básicamente, este operador selecciona el elemento correcto del array para la actualización.

quantity: es el campo del objeto dentro del array products cuyo valor queremos incrementar.
*/

const updateQuantityProductInCart = async (cid, pid, quantity) => {
    await checkProductAndCart(cid, pid)

    return await cartDao.update({ _id: cid, "products.product": pid }, { $set: { "products.$.quantity": quantity } }) // Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado. Seteamos la cantidad para que la reemplace por la quantity que se recibe en el body.
}

const deleteProductInCart = async (cid, pid) => {
    await checkProductAndCart(cid, pid)

    return await cartDao.update({ _id: cid, "products.product": pid }, { $inc: { "products.$.quantity": -1 } })// Busca primero el id del carrito y dentro del array de productos del carrito busca el pid que tengamos insertado y le disminuimos la cantidad en uno. 
}

const getCartById = async (id) => {
    return await cartDao.getById(id)
}

const updateCart = async (query, data) => {
    return await cartDao.update(query, data)
}

const deleteAllProductsInCart = async (cid) => {
    return await cartDao.update({_id: cid}, {$set: {product: []}})
} // buscamos por id el carrito y lo actualizamos vaciando el array de productos

// No la exportamos porque es para reutilizar código dentro de nuestro servicio, para poder hacer la verificación sin repetir código. 

const checkProductAndCart = async (cid, pid) => {
    const product = await productDao.getById(pid) // Verificamos si existe el producto
    if (!product) return { product: false } // Manejo del error (devolvemos un objeto que especifica que no está encontrando el id del producto)
    const cart = await cartDao.getById(cid) // Verificamos si existe el carrito
    if (!cart) return { cart: false } // Manejo del error (devolvemos un objeto que especifica que no está encontrando el id del carrito)
}

export default {
    createCart,
    addProductToCart,
    updateQuantityProductInCart,
    deleteProductInCart,
    getCartById,
    updateCart,
    deleteAllProductsInCart
}