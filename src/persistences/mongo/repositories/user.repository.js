import { userModel } from "../models/user.model.js"

const create = async (data) => {
    const user = await userModel.create(data) // data recibida del usuario nuevo
    return user
}

const getAll = async () => {
    const users = await userModel.find()
    return users // retorna los usuarios encontrados
}
const getById = async (id) => {
    const user = await userModel.findById(id) // busca el usuario por su id
    return user
}

const getByEmail = async (email) => {
    const user = await userModel.findOne({ email })
    return user
}

const update = async (id, data) => {
    const user = await userModel.findByIdAndUpdate(id, data, { new: true }) // la propiedad new true nos devuelve el usuario actualizado 
    return user // lo devolvemos
}

const deleteOne = async (id) => {
    const user = await userModel.deleteOne({ _id: id }) // le decimos que elimine el id de mongo que coincida con el id que le estoy enviando
    if (user.deletedCount === 0) return false // Si retorna false no se ha eliminado el usuario
    return true // retornamos el true para que nos indique que la eliminación se realizó de forma correcta ya que no interesa enviar la información del usuario eliminado 
}


const getInactiveSince = async (date) => {
    return await userModel.find({
        $or: [
            { last_connection: { $lt: date } },  // Usuarios con conexión antes de la fecha
            { last_connection: { $exists: false } }  // Usuarios sin ninguna conexión
        ]
    })
}

export default {
    create,
    getAll,
    getById,
    update,
    deleteOne,
    getByEmail,
    getInactiveSince
}