import jwt from "jsonwebtoken"
import envs from "../config/env.config.js"

// Función que crea el token 

export const createToken = (user) => {
    const { _id, email, role, cart } = user // Desestructuramos el id y el email del usuario, que son los que vamos a cifrar en el token. Agregamos el cart para que cuando haga login también obtengamos la información del carrito que corresponde a dicho usuario. 
    const token = jwt.sign({ _id, email, role, cart}, envs.SECRET_CODE, { expiresIn: "5m" }) // 1er parametro: datos del usuario que vamos a cifrar / 2do parámetro: código secreto / 3er parámetro: tiempo de expiración 
    return token
}

// Función que verifica el token

export const verifyToken = (token) => {
    try {
        const decode = jwt.verify(token, envs.SECRET_CODE) // 1er parametro: token que recibimos / 2do parámetro: código secreto (tiene que coincidir con el anterior)
        return decode // Nos debería devolver el id y el email que ciframos anteriormente
    } catch (error) {
        return null // Controlamos el error para que, en el caso de no pasar la verificación, nos devuelva la respuesta de invalid token programada en el endpoint correspondiente (current)
    }
}
