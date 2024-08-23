import { Router } from "express"
import { logger } from "../utils/logger.js"
import cartsRouters from "./carts.routes.js"
import productsRouters from "./products.routes.js"
import sessionRouters from "./session.routes.js"
import userRouters from "./user.routes.js"

const router = Router()

// Indexamos nuestros endpoints

router.use("/products", productsRouters) 
router.use("/carts", cartsRouters)
router.use("/session", sessionRouters)
router.use("/user", userRouters)

router.get("/loggertest", () => {
    logger.log("error", "Esto es un log de error"),
    logger.log("warn", "Esto es un log de warning"),
    logger.log("info", "Esto es un log de info"),
    logger.log("http", "Esto es un log de http")
})

export default router