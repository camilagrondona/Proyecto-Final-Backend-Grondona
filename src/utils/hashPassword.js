import bcrypt from "bcrypt"

// Función que hashea la contraseña 

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //1er parámetro: contraseña a encriptar // 2do parámetro: salt = determina la cantidad de caracteres con la que encripta la contraseña. Como estándar se utilizan 10 caracteres. 
} 

// Función que valida la contraseña. Devuelve valor booleano (true or false) para determinar si la contraseña coincide o no. 

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password) //1er parámetro: data (password recibido por body en el login) // 2do parámetro: usuario del q se obtiene el password
}

