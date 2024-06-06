import { Router } from "express"
import userDao from "../dao/mongoDao/user.dao.js"

const router = Router()

router.post("/register", async (req, res) => {
    try {
        const userData = req.body // Recibimos por el cuerpo del body los datos de usuario
        const newUser = await userDao.create(userData) // Creamos el nuevo usuario utilizando esos datos que recibimos en el body
        if (!newUser) return res.status(400).json({ status: "Error", message: "No se pudo crear el usuario" }) // Manejo del error si no se puede crear el usuario
        res.status(201).json({ status: "Success", payload: newUser }) // Devolvemos el nuevo usuario
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body // Del cuerpo del body recibimos un email y un password para hacer el login
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") { // Verificamos que el usuario sea el que fijamos como administrador
            req.session.user = {
                email,
                role: "admin"
            } // Si se cumple, guardamos una sesión de usuario cuyo rol sea administrador
            return  res.status(200).json({ status: "Success", payload: req.session.user })
        } 

        // Si no se cumple, guardamos una sesión de usuario "normal"

        const user = await userDao.getByEmail(email) // Consultamos el usuario por el email que estamos recibiendo en el cuerpo del body
        if (!user || user.password !== password) {
            return res.status(401).json ({status: "Error", message: "Email o contraseña no válidos"})
        }

        // Registramos la sesión con rol de usuario 

        req.session.user = {
            email,
            role: "user"
        }

        return res.status(200).json({ status: "Success", payload: req.session.user}) // Si pasa las verificaciones nos devuelve la sesión
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

router.get("/logout", async (req,res) => {
    try {
        req.session.destroy() // Cerrar la sesión 
        res.status(200).json({status: "Success", message: "Sesión cerrada con éxito"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
})

export default router