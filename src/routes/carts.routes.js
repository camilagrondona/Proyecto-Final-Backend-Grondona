import { Router } from "express"
import cartsController from "../controllers/carts.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"
import { checkProductAndCart } from "../middlewares/checkProductAndCart.middleware.js"
import { isUserCart } from "../middlewares/isUserCart.js"

const router = Router()

// Configuración de solicitudes / peticiones

router.post("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, isUserCart, cartsController.addProductToCart) // middleware de check product and cart para verificar que ambos existen antes de ejecutar la función e isUserCart para chequear que ese carrito corresponde al usuario logueado

router.put ("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsController.updateQuantityProductInCart)

router.delete ("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsController.deleteProductInCart)

router.get("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.getCartById) 

router.delete("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.deleteAllProductsInCart)

router.get("/:cid/purchase", passportCall("jwt"), authorization(["user", "premium"]), cartsController.purchaseCart)


export default router