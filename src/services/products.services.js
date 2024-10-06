import { productResponseDto } from "../dto/product-response.dto.js"
import error from "../errors/customErrors.js"
import productsRepository from "../persistences/mongo/repositories/products.repository.js"
import { sendMail } from "../utils/sendMails.js"

const create = async (data, user) => {
    let productData = data
    if(user.role === "premium"){
        productData = {...data, owner: user.email}
    }
    const product = await productsRepository.create(productData)
    if (!product) throw error.badRequestError()
    return product
}

const getAll = async (query, options) => {
    const products = await productsRepository.getAll(query, options)
    return products
}

const getById = async (id) => {
    const productData = await productsRepository.getById(id)
    if(!productData) throw error.notFoundError(`Product id ${id} not found`) // Manejo del error con el customErrors. Si le pasamos el mensaje de error personalizado acá se reemplaza el not found por defecto. 
    const product = productResponseDto(productData) // Enviamos la información formateada del DTO
    return product
}

const update = async (id, data) => {
    const product = await productsRepository.update(id, data)
    if (!product) throw error.notFoundError(`Product id ${id} not found`)
    return product
}

const deleteOne = async (id, user) => {
    const productData = await productsRepository.getById(id)
    if(user.role === "premium" && productData.owner !== user.email) {
        throw error.unauthorizedError("User not authorized to delete product")
    }

    if(user.role === "admin" && productData.owner !== "admin") { // Si el usuario es un admin y el producto no es de un admin le enviamos un email al owner y le notificamos que su producto fue eliminado. 
        await sendMail(
            productData.owner, 
            "Product deleted", 
            `Admin deleted product ${productData.title}`
        )
    }

    const product = await productsRepository.deleteOne(id)
    if (!product) throw error.notFoundError(`Product id ${id} not found`)
    return product
}

export default {
    create,
    getAll,
    getById,
    update,
    deleteOne
}