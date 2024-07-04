import mongoose from "mongoose"

const urlDb = "" // Después del net podemos poner el nombre de la base de datos que queremos, sino se crea por defecto "test"

// Función que hace la conexión con la base de datos

export const connectMongoDB = async () => {
// Se utiliza el try catch para capturar el error en caso de que no se esté realizando la conexión de forma correcta para que no se caiga el servidor
    try {
// Conexión con la base de datos
        mongoose.connect(urlDb) 
        console.log("Mongo DB conectado")
    } catch (error) {
        console.log(error)
    }
}