import { request, response } from "express"
import passport from "passport"
import customErrors from "../errors/customErrors.js"

export const passportCall = (strategy) => {
    return async (req = request, res = response, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => { // Equivale a esta lógica del passport config = if (user) return done(null, false, { message: "El usuario ya existe" }) null = error / false = user (porque en ese caso estaba en false porque no hacíamos la inscripcion del usuario por haber error) / info = message. Puede ser un mensaje o no, como se explica más abajo en el info.toString

            if (error) return next(error)
            if (!user) throw customErrors.unauthorizedError(info.message ? info.message : info.toString()) // Si no existe un mensaje, que lo transforme en un string y me lo muestre 
            req.user = user // Si pasa las validaciones, devolvemos el usuario, lo seteamos

            next() // Continúa la función
        })(req, res, next)
    }
}

export const authorization = (roles) => {
    return async (req = request, res = response, next) => {
        try {
            if (!req.user) throw customErrors.notFoundError("User not found") 
            const roleAuthorized = roles.includes(req.user.role)
            if (!roleAuthorized) throw customErrors.unauthorizedError("User not authorized") 

            next() // Si no hay ningún problema, continúa la función
        } catch (error) {
            next(error)
        }
    }
}