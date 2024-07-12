import { Router } from "express"
import passport from "passport"
import userControllers from "../controllers/users.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"
import { userLoginValidator } from "../validators/userLogin.validator.js"

const router = Router()

router.post("/register", passportCall("register"), userControllers.registerUser)

router.post("/login", passport.authenticate("login"), userControllers.loginUserLocal)

router.post("/jwt", userLoginValidator, userControllers.loginJWT) // Json web token

router.get("/current", passportCall("jwt"), authorization("user"), userControllers.tokenVerification) // Verificación del token

router.get("/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"], // Le indicamos los endpoint de donde va a sacar la info  
    session: false
}), userControllers.googleLogin) // Login de passport con google 

router.get("/logout", userControllers.userLogout)

// passport.authenticate - Es un middleware por el que tiene que pasar nuestra autenticación antes de continuar con la ejecución de la función

// Después del passport.authenticate le pasamos el nombre de la estrategia de autenticación que vamos a utilizar en ese endpoint

export default router