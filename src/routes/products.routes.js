import { Router } from "express"
import productsController from "../controllers/products.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", passportCall("jwt"), authorization("admin"), productsController.create) // solo un usuario con rol de administrador puede crear un producto

router.get("/", productsController.getAll) 

router.get("/mockingproducts", productsController.createProductsMocks) 

router.get("/:pid", productsController.getById) 

router.put("/:pid", passportCall("jwt"), authorization("admin"), productsController.update)

router.delete("/:pid", passportCall("jwt"), authorization("admin"), productsController.deleteOne)

export default router