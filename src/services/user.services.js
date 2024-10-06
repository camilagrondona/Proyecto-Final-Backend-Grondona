import error from "../errors/customErrors.js"
import userRepository from "../persistences/mongo/repositories/user.repository.js"
import { createHash, isValidPassword } from "../utils/hashPassword.js"
import { sendMail } from "../utils/sendMails.js"

const sendEmailResetPassword = async (email) => {
    const message = "You need to reset your password using this link https://www.google.com"
    await sendMail(email, "Reset password", message)
    return "Email sent"
}

const resetPassword = async (email, password) => {
    const user = await userRepository.getByEmail(email)
    if (!user) throw error.notFoundError("User not found")
    const passwordIsEqual = isValidPassword(user, password)
    if (passwordIsEqual) throw error.badRequestError("Password already exists")
    return await userRepository.update(user._id, { password: createHash(password) })
}

const changeUserRole = async (uid) => {
    const user = await userRepository.getById(uid)
    if (!user) throw error.notFoundError("User not found")
    // Validamos que los usuarios tengan los documentos necesarios para cambiar de rol
    if (user.role === "user" && user.documents.length < 3) throw error.badRequestError("You must upload all required documentation") // si el rol es usuario y no tiene los documentos le damos error
    const userRole = user.role === "premium" ? "user" : "premium"
    return await userRepository.update(uid, { role: userRole })
}

const addDocuments = async (uid, reqFiles) => {
    const files = reqFiles.document
    const userDocuments = files.map((file) => {
        return {
            name: file.filename,
            reference: file.path,
        }
    })

    const user = await userRepository.update(uid, { documents: userDocuments })

    return user
}

const getAllUsers = async () => {
    // Llamamos al repositorio que obtiene todos los usuarios
    const users = await userRepository.getAll()
    return users // Retornamos la lista completa de usuarios
}

const deleteInactiveUsers = async () => {
    const twoDaysAgo = new Date()  // Creamos una variable para almacenar la fecha límite de actividad
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2) // Restamos dos días a la fecha actual para obtener la fecha límite
    const inactiveUsers = await userRepository.getInactiveSince(twoDaysAgo) // Encontramos usuarios cuya última conexión fue hace más de 2 días
    const deletedUsers = [] // Creamos un array vacío para almacenar los correos de los usuarios eliminados
    for (const user of inactiveUsers) {  // Iteramos sobre la lista de usuarios inactivos
        await userRepository.deleteOne(user._id) // Para cada usuario, llamamos al repositorio para eliminarlo de la base de datos

        const message = `Hello ${user.first_name}, your account has been deleted due to inactivity for more than two days.` // Después de eliminar al usuario, preparamos un mensaje de correo
        await sendMail(user.email, "Account deleted for inactivity", message)  // Enviamos un correo al usuario informándole que su cuenta fue eliminada

        deletedUsers.push(user.email) // Agregamos el correo del usuario eliminado al array
    }
    return deletedUsers // Retornamos los usuarios eliminados
}


export default { sendEmailResetPassword, resetPassword, changeUserRole, addDocuments, getAllUsers, deleteInactiveUsers }
