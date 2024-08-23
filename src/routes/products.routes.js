import { Router } from "express"
import productsController from "../controllers/products.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.get("/", productsController.getAll) 

router.get("/:pid", productsController.getById) 

router.post("/", passportCall("jwt"), authorization(["admin", "premium"]), productsController.create) 

router.put("/:pid", passportCall("jwt"), authorization(["admin", "premium"]), productsController.update)

router.delete("/:pid", passportCall("jwt"), authorization(["admin", "premium"]), productsController.deleteOne)

router.get("/mockingproducts", productsController.createProductsMocks) 

export default router