import { Router } from "express"
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../managers/productManager.js" // Importamos los métodos del productManager

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", create)
router.get("/", read)
router.get("/:pid", readOne) // parámetro pid (product ID)
router.put("/:pid", update)
router.delete("/:pid", destroy)

// Callback create (para crear un nuevo producto)

async function create(req, res) {
    try {
        const product = req.body // capturamos los datos en la variable product y con el método create creamos un nuevo producto 
        const newProduct = await addProduct(product)
        return res.json({ status: 201, response: newProduct }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback read (para leer todos los productos) - Query limit

async function read(req, res) {
    try {
        const { limit } = req.query
        let all = await getProducts(limit)
        return res.json({ status: 200, response: all })
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback readOne (para leer un producto según su ID)

async function readOne(req, res) {
    try {
        const { pid } = req.params // Todos los parámetros vienen siempre en formato string
        const one = await getProductById(+pid) // Transforma en número el dato que estamos recibiendo. Es como el parseInt
        if (one) {
            return res.json({ status: 200, response: one }) // Express por defecto manda un status 200, así que en caso de no especificarlo no afectaría 
        } else {
            const error = new Error("Not found") // Se crea con el mensaje de error
            error.status = 404 // Se configura el estado 
            throw error // Se arroja el error para manejarlo con el catch
        }
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" }) 
    }
}

// Callback update (para actualizar un producto según su ID)

async function update(req, res) {
    try {
        const { pid } = req.params // capturamos el parámetro. De ese objeto de requerimiento req.params desestructuramos el product ID. 
        const product = req.body // capturamos el objeto con las modificaciones
        const updatedProduct = await updateProduct(+pid, product)// actualizamos el recurso pasándole el ID y la información a modificar (product que recibimos por el body)
        return res.json({ status: 200, response: updatedProduct })//enviamos la respuesta al cliente con el objeto actualizado
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" })
    }
}

// Callback destroy (para eliminar un producto según su ID)

async function destroy(req, res) {
    try {
        const { pid } = req.params // capturamos el id
        await deleteProduct(+pid) // eliminamos el recurso 
        return res.json({ status: 200, message: "Producto eliminado"})
} catch (error) {
    console.log(error)
    return res.json({ status: error.status || 500, response: error.message || "Error" }) // dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
}
}

export default router