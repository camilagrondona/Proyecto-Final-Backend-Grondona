import { logger } from "../utils/logger.js"

export const errorHandle = (err, req, res, next) => {
    const status = err.status || 500 // Si el middleware no puede detectar que tipo de error es, por defecto se usará el 500
    const message = status === 500 ? "Internal Server Error" : err.message // Si el status es 500, "internal server error", y sino mostramos el error del servidor
    if(status === 500) {
        logger.log("error", `${err.path || ""} - ${err.message}`)
    } // pasamos el mensaje de error en caso de que sea 500 para mostrar estos mensajes ya que este tipo de error es importante de loggear

    res.status(status).json({
    error: {
        message,
        status
        }
    })
}