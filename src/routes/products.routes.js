import { Router } from "express"
import productsController from "../controllers/products.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"
import { productDataValidator } from "../validators/productData.validator.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/", passportCall("jwt"), authorization("admin"), productDataValidator, productsController.addProduct) // solo un usuario con rol de administrador puede crear un producto

router.get("/", productsController.getAllProducts) 

router.get("/:pid", productsController.getProductById) 

router.put("/:pid", passportCall("jwt"), authorization("admin"), productsController.updateProduct)

router.delete("/:pid", passportCall("jwt"), authorization("admin"), productsController.deleteProduct)

export default router