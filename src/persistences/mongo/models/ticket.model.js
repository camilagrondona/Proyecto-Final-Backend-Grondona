import mongoose from "mongoose"

const ticketCollection = "tickets" // Nombre de la colección de tickets

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datatime: {
        type: Date, 
        default: Date.now() // Se genera la hora y fecha automáticamente
    },
    amount: {
        type: Number,
        required: true
    }, 
    purchaser: {
        type: String,
        required: true
    }
})

ticketSchema.pre("find", function(){
    this.populate("products.product")
})

// Modelo de ticket

export const ticketModel = mongoose.model(ticketCollection, ticketSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema