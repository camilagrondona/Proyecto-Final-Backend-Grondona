import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products" // Nombre de la colección de productos

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    }
})

productSchema.plugin(mongoosePaginate) // Plugin instalado para utilizar el paginate

// Modelo de producto

export const productModel = mongoose.model(productCollection, productSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema