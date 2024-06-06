import { request, response } from "express"

export const isLogin = async (req = request, res = response, next) => {
    if (req.session.user) {
        next() // Si la sesión existe (hay un usuario logueado), sigue con la función. Devuelve valores booleanos
    } else {
        res.status(401).json({status:"Error", message: "Usuario no logueado"})
    }
}