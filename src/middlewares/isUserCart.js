// Middleware para corroborar que el carrito pertenece a ese usuario

import { request, response } from "express"

export const isUserCart = async (req = request, res = response, next) => {
    const { cid } = req.params // Tomamos el cart id de los parámetros
    if(req.user.cart !== cid) return res.status(401).json({status: "Error", msg: `The cart with id ${cid} does not belong to the user`}) // Si el carrito del usuario logueado (extrae esta info de las cookies) no coincide con el cart id mandamos mensaje de error
    next() // En caso de que no se cumpla la condición, sigue la función
}