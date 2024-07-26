import { productResponseDto } from "../dto/product-response.dto.js"
import productsRepository from "../persistences/mongo/repositories/products.repository.js"

const create = async (data) => {
    const product = await productsRepository.create(data)
    return product
}

const getAll = async (query, options) => {
    const products = await productsRepository.getAll(query, options)
    return products
}

const getById = async (id) => {
    const productData = await productsRepository.getById(id)
    const product = productResponseDto(productData) // Enviamos la información formateada del DTO
    return product
}

const update = async (id, data) => {
    const product = await productsRepository.update(id, data)
    return product
}

const deleteOne = async (id) => {
    const product = await productsRepository.deleteOne(id)
    return product
}

export default {
    create,
    getAll,
    getById,
    update,
    deleteOne
}