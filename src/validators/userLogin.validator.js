import {body, validationResult} from "express-validator"

export const userLoginValidator = [
    body("email")
    .isEmail().withMessage("El correo debe ser un email válido") // Verificar la propiedad email que se recibe por body. El isEmail verifica que el dato que estoy recibiendo sea de tipo email (que tiene los caracteres específicos de este tipo de dato). Por ejemplo, si no tiene un arroba o un .com/ net detecta que no es de tipo email. 
    .notEmpty().withMessage("El correo es obligatorio"), // Verificar que no llegue vacío
    body("password")
    .notEmpty().withMessage("La contraseña es obligatoria"),
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