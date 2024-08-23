import { request, response } from "express"
import customErrors from "../errors/customErrors.js"

export const isLogin = async (req = request, res = response, next) => {
    if (req.session.user) {
        next() // Si la sesión existe (hay un usuario logueado), sigue con la función. Devuelve valores booleanos
    } else {
        throw customErrors.unauthorizedError("You are not logged in")
    }
}