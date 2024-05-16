import mongoose from "mongoose"

const cartCollection = "carts" // Nombre de la colección de carts

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

// Modelo de cart

export const cartModel = mongoose.model(cartCollection, cartSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema