import mongoose from "mongoose"

const userCollection = "users" // Nombre de la colección de users

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    age: Number,
    role: {
        type: String,
        enum: ["user", "admin"], // enumera los roles de usuario que podemos tener
        default: "user" // Por defecto el rol es usuario
    },
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts"} // Asociamos un carrito específico a cada usuario
})

// Modelo de user

export const userModel = mongoose.model(userCollection, userSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema