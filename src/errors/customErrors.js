const notFoundError = (message = "Not Found") => { // si la función no recibe un mensaje por parámetro, por defecto devuelve not found
    const error = new Error(message)
    error.status = 404
    return error
}

const badRequestError = (message = "Bad request") => {
    const error = new Error(message)
    error.status = 400
    return error
}

const unauthorizedError = (message = "Unauthorized") => {
    const error = new Error(message)
    error.status = 401
    return error
}

const forbiddenError = (message = "Forbidden") => {
    const error = new Error(message)
    error.status = 403
    return error
}

export default {
    notFoundError,
    badRequestError,
    unauthorizedError,
    forbiddenError
}