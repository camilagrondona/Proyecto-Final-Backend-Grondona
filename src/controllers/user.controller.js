import { userResponseDto } from "../dto/user-response.dto.js"
import customErrors from "../errors/customErrors.js"
import userServices from "../services/user.services.js"

const sendEmailResetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        res.cookie("resetPassword", email, { httpOnly: true, maxAge: 10000 })
        const response = await userServices.sendEmailResetPassword(email)
        res.status(200).json({ status: "Success", response })
    } catch (error) {
        error.path = "[POST] /api/user/email/reset-password"
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const emailCookie = req.cookies.resetPassword
        if (!emailCookie) throw customErrors.badRequestError("Email link expired")
        await userServices.resetPassword(email, password)
        res.status(200).json({ status: "Success", message: "Password updated" })
    } catch (error) {
        error.path = "[POST] /api/user/reset-password"
        next(error)
    }
}

const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params
        const response = await userServices.changeUserRole(uid)
        res.status(200).json({ status: "Success", response })
    } catch (error) {
        error.path = "[GET] /api/user/premium/:uid"
        next(error)
    }
}

const addDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params
        const files = req.files
        const response = await userServices.addDocuments(uid, files)
        res.status(200).json({ status: "ok", response })
    } catch (error) {
        error.path = "[POST] /api/user/:uid/documents"
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        // Llamamos al servicio que obtiene todos los usuarios de la base de datos
        const users = await userServices.getAllUsers()
        
        // Aplicamos el DTO a cada usuario para filtrar la información
        const usersDto = users.map(user => userResponseDto(user))
        
        // Enviamos la respuesta con los usuarios filtrados
        res.status(200).json({ status: "Success", users: usersDto })
    } catch (error) {
        error.path = "[GET] /api/user/get-all-users"
        next(error)
    }
}

const deleteInactiveUsers = async (req, res, next) => {
    try {
        const deletedUsers = await userServices.deleteInactiveUsers() // Servicio para eliminar usuarios inactivos
        res.status(200).json({ status: "Success", deletedUsers })
    } catch (error) {
        error.path = "[DELETE] /api/user/delete-inactive-users"
        next(error)
    }
}

export default { sendEmailResetPassword, resetPassword, changeUserRole, addDocuments, getAllUsers, deleteInactiveUsers }