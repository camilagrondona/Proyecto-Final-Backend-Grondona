import { userResponseDto } from "../dto/user-response.dto.js"
import { createToken } from "../utils/jwt.js"
import { logger } from "../utils/logger.js"

// En este controller no hay ningún llamado a la base de datos, ya que esta conexión se hace en passport config (estrategias de autenticación y registro). Por eso no hace falta tampoco tener servicios. En caso de que el passport creciera mucho, se puede desarrollar la lógica de las estrategias en un servicio. 

const register = async (req, res, next) => {
    try {
        res.status(201).json({ status: "success", message: "User created successfully" })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const user = req.user
        const token = createToken(user) // Creamos el token
        res.cookie("token", token, { httpOnly: true }) // Guardamos el token en una cookie. 1er parametro: nombre de la cookie (token) // 2do parámetro: pasamos la info del token // 3er parámetro: a la cookie solo se puede acceder con una petición http
        const userDto = userResponseDto(user) // usamos el dto con los datos del usuario que queremos que retorne para que no nos dé toda la información completa en la response
        return res.status(200).json({ status: "success", payload: userDto, token })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const current = async (req, res, next) => {
    try {
        const user = req.user 
        return res.status(200).json({ status: "Success", payload: user }) // Si pasa las verificaciones nos devuelve los datos del usuario filtrado por el DTO
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const loginGoogle = (req, res, next) => {
    try {
        return res.status(200).json({ status: "success", payload: req.user }) // En caso de pasar la verificación, devolvemos la info que tenemos del token
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        req.session.destroy() // Cerrar la sesión 
        res.status(200).json({ status: "Success", message: "Sesión cerrada con éxito" })
    } catch (error) {
        logger.log("error", error.message)
        next(error)
    }
}

export default {
    register,
    login,
    current,
    loginGoogle,
    logout
}