import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products" // Nombre de la colección de productos

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        type: Array,
        default: []
    },
    code: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        require: true
    }
})

productSchema.plugin(mongoosePaginate) // Plugin instalado para utilizar el paginate

// Modelo de producto

export const productModel = mongoose.model(productCollection, productSchema) // Primer parámetro: nombre de la colección - Segundo parámetro: Schema