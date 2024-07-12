import mongoose from "mongoose"
import envs from "./env.config.js"

// Función que hace la conexión con la base de datos

export const connectMongoDB = async () => {
// Se utiliza el try catch para capturar el error en caso de que no se esté realizando la conexión de forma correcta para que no se caiga el servidor
    try {
// Conexión con la base de datos
        mongoose.connect(envs.MONGO_URL) 
        console.log("Mongo DB connected")
    } catch (error) {
        console.log(error)
    }
}