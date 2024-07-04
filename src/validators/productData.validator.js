import { body, validationResult } from "express-validator"

export const productDataValidator = [
    body("title")
        .isString().withMessage("El título tiene que tener formato texto")
        .isEmpty().withMessage("El título es obligatorio")
        .isLength({ min: 3 }).withMessage("El título debe tener al menos 3 caracteres"),
    body("description")
        .isString().withMessage("La descripción tiene que tener formato texto")
        .isEmpty().withMessage("La descripción es obligatoria")
        .isLength({ min: 3 }).withMessage("La descripción debe tener al menos 3 caracteres"),
    body("thumbnail")
        .isArray().withMessage("Tiene que ser un array"),
    body("code")
        .isString().withMessage("El código tiene que tener formato texto")
        .isEmpty().withMessage("El código es obligatorio")
        .isLength({ min: 3 }).withMessage("El código debe tener al menos 3 caracteres"),
    body("stock")
    .isNumeric().withMessage("El stock debe ser de tipo numérico")
    .isLength({min: 1}).withMessage("El stock debe tener al menos 1 caracter")
    .isEmpty().withMessage("El stock es obligatorio"),
    body("status")
    .isBoolean().withMessage("El status debe ser de tipo booleano"),
    body("price")
    .isNumeric().withMessage("El precio debe ser de tipo numérico")
    .isLength({min: 1}).withMessage("El precio debe tener al menos 1 caracter")
    .isEmpty().withMessage("El precio es obligatorio"),
    body("category")
    .isString().withMessage("La categoría tiene que tener formato texto")
    .isEmpty().withMessage("La categoría es obligatoria")
    .isLength({ min: 3 }).withMessage("La categoría debe tener al menos 3 caracteres"),
    (req, res, next) => {
        const errors = validationResult(req) // valida lo que llega por request (lo que recibe en el body)
        // verificamos si hay algún error
        if(!errors.isEmpty()){ // si el error no viene vacío significa que hubo un problema
        // Formateamos la respuesta de errores
        const formatErrors = errors.array().map(e => {
            return {Message: e.msg, Data: e.path}
        }) 
            return res.status(400).json({status: "Error", Errors: formatErrors})
        }
        next() // Si no hay errores, continúa la función
    }
]