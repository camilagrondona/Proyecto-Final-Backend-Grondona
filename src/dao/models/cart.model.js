import mongoose from "mongoose"

const cartCollection = "carts" // Nombre de la colección de carts

const cartSchema = new mongoose.Schema({
    products: {
        type: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, quantity: Number }]
    }
})

cartSchema.pre("find", function(){
    this.populate("products.product")
})

// Modelo de cart

export const cartModel = mongoose.model(cartCollection, cartSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema