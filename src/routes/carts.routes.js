import { Router } from "express"
import cartsController from "../controllers/carts.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"

const router = Router()

// Configuración de solicitudes / peticiones

 router.post("/", passportCall("jwt"), authorization("user"), cartsController.createCart) // El middleware de authorization necesita saber qué tipo de usuario es, por eso tenemos que llamar a la estrategia primero, para evitar que el usuario quede como undefined y no avance en la función. 

router.post("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.addProductToCart) 

router.put ("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.updateQuantityProductInCart)

router.delete ("/:cid/product/:pid", passportCall("jwt"), authorization("user"), cartsController.deleteProductInCart)

router.get("/:cid", passportCall("jwt"), authorization("user"), cartsController.getCartById) 

router.put ("/:cid", passportCall("jwt"), authorization("user"), cartsController.updateCart)

router.delete("/:cid", passportCall("jwt"), authorization("user"), cartsController.deleteAllProductsInCart)

export default router