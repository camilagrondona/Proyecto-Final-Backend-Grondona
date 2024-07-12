import cartDao from "../dao/mongoDao/cart.dao.js"

const createCart = async (req, res) => {
    try {
        const cart = await cartDao.create()
        return res.status(201).json({ status: "Success", payload: cart }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const addProductToCart = async (req, res) => {
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

const updateQuantityProductInCart = async (req, res) => {
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

const deleteProductInCart = async (req, res) => {
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

const getCartById = async (req, res) => {
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

const updateCart = async (req, res) => {
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

const deleteAllProductsInCart = async (req, res) => {
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

export default {
    createCart,
    addProductToCart,
    updateQuantityProductInCart,
    deleteProductInCart,
    getCartById,
    updateCart,
    deleteAllProductsInCart
}