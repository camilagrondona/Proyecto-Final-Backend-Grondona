import { Router } from "express"
import passport from "passport"
import userDao from "../dao/mongoDao/user.dao.js"
import { isValidPassword } from "../utils/hashPassword.js"
import { createToken, verifyToken } from "../utils/jwt.js"

const router = Router()

router.post("/register", passport.authenticate("register"), async (req, res) => {
    try {
        res.status(201).json({ status: "success", message: "Usuario creado con éxito" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

// passport.authenticate - Es un middleware por el que tiene que pasar nuestra autenticación antes de continuar con la ejecución de la función

// Login de passport local 

router.post("/login", passport.authenticate("login"), async (req, res) => {
    try {
        return res.status(200).json({ status: "Success", payload: req.user }) // Si pasa las verificaciones nos devuelve los datos que passport almacena en nuestro usuario
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

// Json web token

router.post("/jwt", async (req, res) => {
    try {
        const { email, password } = req.body // Recibimos por body estos datos para hacer el login del usuario
        const user = await userDao.getByEmail(email)
        if (!user || !isValidPassword(user, password)) return res.status(401).json({ status: "Error", message: "Usuario o contraseña inválidos" })  // Si no hay un usuario logueado o si no coincide la contraseña no se avanza con el logueo (false)
        const token = createToken(user) // Creamos el token
        res.cookie("token", token, {httpOnly: true}) // Guardamos el token en una cookie. 1er parametro: nombre de la cookie (token) // 2do parámetro: pasamos la info del token // 3er parámetro: a la cookie solo se puede acceder con una petición http
        return res.status(200).json({ status: "success", payload: user, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

// Verificación del token

router.get("/current", (req, res) => {
    try {
        const token = req.cookies.token // Recibimos el token desde la cookie en la que está almacenado 
        const checkToken = verifyToken(token) // verificamos el token que recibimos por body
        if(!checkToken) return res.status(403).json({status: "Error", message: "Invalid token"}) // En caso de que no pase la verificación, retornamos un status 403 (no permitimos el acceso)
        return res.status(200).json({ status: "success", payload: checkToken }) // En caso de pasar la verificación, devolvemos la info que tenemos del token
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

// Login de passport con google 

router.get("/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"], // Le indicamos los endpoint de donde va a sacar la info  
    session: false
}), async (req, res) => {
    try {
        return res.status(200).json({ status: "Success", payload: req.user }) // Si pasa las verificaciones nos devuelve los datos que passport almacena en nuestro usuario
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy() // Cerrar la sesión 
        res.status(200).json({ status: "Success", message: "Sesión cerrada con éxito" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

export default router