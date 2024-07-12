import userDao from "../dao/mongoDao/user.dao.js"
import { isValidPassword } from "../utils/hashPassword.js"
import { createToken } from "../utils/jwt.js"

const registerUser = async (req, res) => {
    try {
        res.status(201).json({ status: "success", message: "Usuario creado con éxito" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
}

const loginUserLocal = async (req, res) => {
    try {
        return res.status(200).json({ status: "Success", payload: req.user }) // Si pasa las verificaciones nos devuelve los datos que passport almacena en nuestro usuario
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
}

const loginJWT = async (req, res) => {
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
}

const tokenVerification = (req, res) => {
    try {
        return res.status(200).json({ status: "success", payload: req.user }) // En caso de pasar la verificación, devolvemos la info que tenemos del token
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
}

const googleLogin = async (req, res) => {
    try {
        return res.status(200).json({ status: "Success", payload: req.user }) // Si pasa las verificaciones nos devuelve los datos que passport almacena en nuestro usuario
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy() // Cerrar la sesión 
        res.status(200).json({ status: "Success", message: "Sesión cerrada con éxito" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Internal Server Error" })
    }
}

export default {
registerUser,
loginUserLocal,
loginJWT,
tokenVerification,
googleLogin,
userLogout
}