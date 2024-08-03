// Middleware para corroborar que el carrito pertenece a ese usuario

import { request, response } from "express"
import error from "../errors/customErrors.js"

export const isUserCart = async (req = request, res = response, next) => {
    const {cid} = req.params // Tomamos el cart id de los parámetros
    if(req.user.cart !== cid) throw error.unauthorizedError("El id del carrito no corresponde al usuario") // Si el carrito del usuario logueado (extrae esta info de las cookies) no coincide con el cart id mandamos mensaje de error. Estado 401: No autorizado
    next() // En caso de que no se cumpla la condición, sigue la función
}
