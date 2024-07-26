/* "payload": {
    "_id": "66742feede9862fee8158548",
    "title": "Camiseta Marvel",
    "description": "Camiseta talle L con diseño Marvel",
    "price": 32000,
    "thumbnail": [
        "http://www.ropacanchera.com/camisas-marvel-1"
    ],
    "code": "CGTP1245",
    "stock": 2,
    "status": true,
    "__v": 0
 */

export const productResponseDto = (product) => {
    return {
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        price: product.price,
        product_code: product.code, // Acá le modificamos el nombre con el que va a responder
        stock: product.stock,
        category: product.category
    }
}