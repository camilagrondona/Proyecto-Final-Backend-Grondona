import { generateProductsMocks } from "../mocks/products.mock.js"
import productsServices from "../services/products.services.js"
import { logger } from "../utils/logger.js"

const create = async (req, res, next) => {
    try {
        const product = req.body // capturamos los datos en la constante product y con el método create creamos un nuevo producto 
        const newProduct = await productsServices.create(product, req.user)
        return res.status(201).json({ status: "Success", payload: newProduct }) //201 es el estado de creación exitosa
    } catch (error) {
        logger.log("error", error.message)
        next(error) // Cuando detecta el error, se ejecuta el middleware errorHandle, lo hace por debajo express cuando le pasamos el next y el error
    }
}

const getAll = async (req, res, next) => {
    try {
        const { limit, page, sort, category, status } = req.query // queries
        const options = {
            limit: limit || 10, // límite que recibimos por parámetro y sino por defecto serán 10
            page: page || 1,
            sort: {
                price: sort === "asc" ? 1 : -1
            }, // por defecto viene en orden descendente
            lean: true
        }

        if (status) {
            const products = await productsServices.getAll({ status: status }, options)
            return res.status(200).json({ status: "Success", products })
        }

        if (category) {
            const products = await productsServices.getAll({ category: category }, options)
            return res.status(200).json({ status: "Success", products })
        }

        const products = await productsServices.getAll({}, options)

        return res.status(200).json({ status: "Success", products })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const { pid } = req.params
        const product = await productsServices.getById(pid)

        return res.status(200).json({ status: "Success", payload: product }) // Express por defecto manda un status 200, así que en caso de no especificarlo no afectaría 
    } catch (error) {
        logger.log("error", error.message)
        next(error) 
    }
}

const update = async (req, res, next) => {
    try {
        const { pid } = req.params // capturamos el parámetro. De ese objeto de requerimiento req.params desestructuramos el product ID. 
        const productData = req.body // capturamos el objeto con las modificaciones

        const updatedProduct = await productsServices.update(pid, productData)//  actualizamos el recurso pasándole el ID y la información a modificar (que recibimos por el body)

        return res.status(200).json({ status: "Success", payload: updatedProduct }) //enviamos la respuesta al cliente con el objeto actualizado
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const deleteOne = async (req, res, next) => {
try {
    const { pid } = req.params // capturamos el id
    await productsServices.deleteOne(pid, req.user) // eliminamos el recurso 

    return res.status(200).json({ status: "Success", payload: "Product deleted" })
} catch (error) {
    logger.log("error", error.message)
    next(error)
}
}

const createProductsMocks = async (req, res) => {
    const products = generateProductsMocks(100)
    return res.status(200).json({status:"Success", products})
}

export default {
    create,
    getAll,
    getById,
    update,
    deleteOne,
    createProductsMocks
}