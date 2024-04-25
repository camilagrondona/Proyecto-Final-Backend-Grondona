import { Router } from "express"
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../data/fs/productManager.js" // Importamos los métodos del productManager

const router = Router()

// Configuración de solicitudes / peticiones

router.post ("/", create)
router.get("/", read)
router.get("/:pid", readOne) // parámetro pid (product ID)
router.put("/:pid", update)
router.delete("/:pid", destroy)

// Callback create (para crear un nuevo producto)

async function create (req, res) {
    try {
        const data = req.body // capturamos los datos en la variable data y con el método create creamos un nuevo producto 
        const one = await addProduct (data) 
        return res.json ({status: 201, response: one }) //201 es el estado de creación exitosa
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, response: error.message })
    }
}

// Callback read (para leer todos los productos) - Query limit

async function read(req, res) {
    try {
        const {limit} = req.query
        let all = await getProducts(limit)
        return res.json({ status: 200, response: all })
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, response: error.message })
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
        return res.json({ status: error.status || 500, response: error.message || "Error" }) // Dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
    }
}

// Callback update (para actualizar un producto según su ID)

async function update(req, res) {
    try {
        const { pid } = req.params // capturamos el parámetro. De ese objeto de requerimiento req.params desestructuramos el product ID. 
        const data = req.body // capturamos el objeto con las modificaciones
        const one = await updateProduct (pid, data)// actualizamos el recurso pasándole el ID y la información a modificar
        if (one) {
            return res.json ({status: 200, response: one})// condicionamos y enviamos la respuesta al cliente con el objeto actualizado
        } // tiene que tirar un error si el id que pasamos no es correcto / no existe
        const error = new Error ("Not found")
        error.status = 404
        throw error
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" }) // dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
    }
}

// Callback destroy (para eliminar un producto según su ID)

async function destroy (req,res) {
    try {
        const {pid} = req.params // capturamos el id
        const one = await getProducts (pid) // buscar el recurso 
        if (one) { // si existe, eliminamos el recurso
            await deleteProduct (pid)
            return res.json ({status: 200, response: one})
        } // en caso de que no existe definimos el error
        const error = new Error ("Not found")
        error.status = 404
        throw error
        // condicionamos y enviamos la respuesta al cliente
    } catch (error) {
        console.log(error)
        return res.json({ status: error.status || 500, response: error.message || "Error" }) // dejamos el error 500 o el "ERROR" con el operador or por si los anteriores no existen
    }
}
export default router