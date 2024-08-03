import { request, response } from "express"
import error from "../errors/customErrors.js"

export const isLogin = async (req = request, res = response, next) => {
    if (req.session.user) {
        next() // Si la sesión existe (hay un usuario logueado), sigue con la función. Devuelve valores booleanos
    } else {
        throw error.unauthorizedError("Usuario no logueado")
    }
}