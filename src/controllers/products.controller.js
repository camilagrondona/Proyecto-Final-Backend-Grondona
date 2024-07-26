import productsServices from "../services/products.services.js"

const create = async (req, res) => {
    try {
        const product = req.body // capturamos los datos en la constante product y con el método create creamos un nuevo producto 
        const newProduct = await productsServices.create(product)
        return res.status(201).json({ status: "Success", payload: newProduct }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const getAll = async (req, res) => {
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
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const getById = async (req, res) => {
    try {
        const { pid } = req.params
        const one = await productsServices.getById(pid)
        if (!one) return res.status(404).json({ status: "Error", message: "Not found" })

        return res.status(200).json({ status: "Success", payload: one }) // Express por defecto manda un status 200, así que en caso de no especificarlo no afectaría 
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const update = async (req, res) => {
    try {
        const { pid } = req.params // capturamos el parámetro. De ese objeto de requerimiento req.params desestructuramos el product ID. 
        const productData = req.body // capturamos el objeto con las modificaciones

        const updatedProduct = await productsServices.update(pid, productData)//  actualizamos el recurso pasándole el ID y la información a modificar (que recibimos por el body)
        if (!updatedProduct) return res.status(404).json({ status: "Error", message: "Not Found" }) // En caso de no encontrar el producto con ese ID devolvemos un error

        return res.status(200).json({ status: "Success", payload: updatedProduct }) //enviamos la respuesta al cliente con el objeto actualizado
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

const deleteOne = async (req, res) => {
try {
    const { pid } = req.params // capturamos el id
    const product = await productsServices.deleteOne(pid) // eliminamos el recurso 
    if (!product) return res.status(404).json({ status: "Error", message: "Not found" }) // Si nos devuelve un false (porque no ha eliminado nada, se muestra el mensaje de error)

    return res.status(200).json({ status: "Success", payload: "Producto eliminado" })
} catch (error) {
    console.log(error)
    return res.status(200).json({ status: error.status || 500, response: error.message || "Error" }) // dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
}
}

export default {
    create,
    getAll,
    getById,
    update,
    deleteOne
}