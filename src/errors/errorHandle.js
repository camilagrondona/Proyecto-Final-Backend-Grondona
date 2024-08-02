export const errorHandle = (error, req, res, next) => {
    const status = error.status || 500 // Si el middleware no puede detectar que tipo de error es, por defecto se usará el 500
    const message = status === 500 ? "Internal Server Error" : error.message // Si el status es 500, "internal server error", y sino mostramos el error del servidor

    res.status(status).json({error: {
        message,
        status
    }})
}