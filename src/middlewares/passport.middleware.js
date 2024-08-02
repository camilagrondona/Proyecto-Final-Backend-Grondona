import { request, response } from "express"
import passport from "passport"

export const passportCall = (strategy) => {
    return async (req = request, res = response, next) => {
        passport.authenticate(strategy, {session: false}, (error, user, info) => { // Equivale a esta lógica del passport config = if (user) return done(null, false, { message: "El usuario ya existe" }) null = error / false = user (porque en ese caso estaba en false porque no hacíamos la inscripcion del usuario por haber error) / info = message. Puede ser un mensaje o no, como se explica más abajo en el info.toString
            if(error) return next(error)
            if(!user) throw error.unauthorizedError({ message: info.message ? info.message : info.toString()}) // Si no existe un mensaje, que lo transforme en un string y me lo muestre 
            req.user = user // Si pasa las validaciones, devolvemos el usuario, lo seteamos
            next() // Continúa la función
        }) (req, res, next)
    }
}

export const authorization = (role) => {
    return async (req = request , res = response, next) => {
        if(!req.user) throw error.unauthorizedError() // Chequeamos si existe un usuario en la sesión
        if(req.user.role !== role) throw error.forbiddenError() // Si el rol del usuario que inició sesión no es igual al que recibimos por parámetro (que es quienes estarían autorizados), devolvemos error. 403 es error de autorización
        next() // Si no hay ningún problema, continúa la función
    }
}