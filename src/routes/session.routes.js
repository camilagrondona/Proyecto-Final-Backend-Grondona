import { Router } from "express"
import passport from "passport"
import sessionControllers from "../controllers/sessions.controller.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"
import { sendMail } from "../utils/sendMails.js"
import { sendSMS } from "../utils/sendSMS.js"

const router = Router()

router.post("/register", passportCall("register"), sessionControllers.register)

router.post("/login", passportCall ("login"), sessionControllers.login)

router.get("/current", passportCall("jwt"), authorization("user"), sessionControllers.current) // Verificación del token

router.get(
    "/google", 
    passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"], // Le indicamos los endpoint de donde va a sacar la info  
    session: false
}), 
sessionControllers.loginGoogle) // Login de passport con google 

router.get("/logout", sessionControllers.logout)

router.get("/email", async (req, res) => {
    const {name} = req.body // Desestructuramos el nombre del body para utilizarlo en la plantilla

    const template = 
    `<div> 
    <h1> Bienvenida ${name} a mi app </h1>
    <img src="cid:perrito"/> 
    </div>`

    await sendMail("ornella.grondona@gmail.com", "Test nodemailer", "Este es un mensaje de prueba", template)

    return res.status(200).json({status:"Success", message: "Email sent"})
})

router.get("/sms", async (req, res) => {
    await sendSMS("+18777804236", "Coder es lo más!!")
    return res.status(200).json({status:"Success", message: "SMS sent"})
})

export default router

