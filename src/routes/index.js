import { Router } from "express"
import productsRouters from "./products.routes.js"
import cartsRouters from "./carts.routes.js"
import sessionRouters from "./session.routes.js"
import {isLogin} from "../middlewares/isLogin.middleware.js"

const router = Router()

// Indexamos nuestros endpoints

router.use("/products", isLogin, productsRouters) //  Chequea si el usuario está logueado en todos los endpoint de productos, y ahí nos devuelve la consulta (con el middleware isLogin)
router.use("/carts", cartsRouters)
router.use("/session", sessionRouters)

export default router