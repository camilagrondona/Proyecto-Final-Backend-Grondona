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
    age: Number
})

// Modelo de user

export const userModel = mongoose.model(userCollection, userSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema