import { Router } from "express"
import cartsController from "../controllers/carts.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"
import { checkProductAndCart } from "../middlewares/checkProductAndCart.middleware.js"
import { isUserCart } from "../middlewares/isUserCart.js"

const router = Router()

// Configuración de solicitudes / peticiones

// Buscar carrito por ID

router.get("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.getCartById) 

//Añadir productos al carrito

router.post("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, isUserCart, cartsController.addProductToCart)

// Actualizar cantidad de un producto en el carrito

router.put ("/:cid/product/:pid", passportCall("jwt"), authorization("user"), checkProductAndCart, cartsController.updateQuantityProductInCart)

// Borrar un producto del carrito 

router.delete ("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]),checkProductAndCart, cartsController.deleteProductInCart)

// Borrar todos los productos del carrito

router.delete("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.deleteAllProductsInCart)

// Realizar la compra de los productos del carrito

router.get("/:cid/purchase", passportCall("jwt"), authorization(["user", "premium"]), cartsController.purchaseCart)


export default router