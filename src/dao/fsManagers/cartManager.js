import fs from "fs" // Inicializamos file system

let carts = [] // Creamos la lista de carritos vacía

let pathFile = "./src/data/fs/files/carts.json" // Ruta de los carritos

// Crear un carrito nuevo (createCart)

const createCart = async () => {
    await getCarts()
    const newCart = {
        id: carts.length + 1,
        products: [] // Cuando se crea el carrito se inicia el array de productos vacío, porque no tiene productos dentro en esa instancia
    }
    carts.push(newCart)
    await fs.promises.writeFile(pathFile, JSON.stringify(carts))
    return newCart
}

// Obtener/leer los carritos (getCarts)

const getCarts = async () => {
    const cartsJson = await fs.promises.readFile(pathFile, "utf8")
    carts = JSON.parse(cartsJson) || [] // Si no hay información a la hora de leerlo, se asigna un array vacío 
    return carts
}

// Buscar un carrito por su id y leer los products (getCartById)

const getCartById = async (cid) => {
    await getCarts() // llamamos a la función para que lea el JSON y nuestros carritos se asignen a la variable 
    const cart = carts.find(c => c.id === cid) // que busque el carrito cuyo id coincida con el que estamos recibiendo por parámetro

    if (!cart) return `No se encuentra el carrito con el id ${cid}` // Si no hay carrito que coincida, devuelve mensaje de error

    return cart.products // Si existe el carrito, devolvemos el array de productos en ese carrito
}

// Agregar un producto al carrito (addProductToCart)

const addProductToCart = async (cid, pid) => {
    try {
        let carts = await fs.promises.readFile(pathFile, "utf8") // Leemos los carritos desde el archivo carts.json
        carts = JSON.parse(carts)

        const index = carts.findIndex(c => c.id === cid) // Buscamos el carrito por su ID (que recibimos por parámetro)

        if (index === -1) return `No se encontró el carrito con el ID ${cid}` // Si no encuentra la posición índice indicada, devuelve mensaje de error

        // Verificamos si el producto ya está en el carrito
        const cart = carts[index]
        const productIndex = cart.products.findIndex(p => p.product === pid)

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 }) // Si el producto no está en el carrito, lo agrega de 1 en 1
        } else {
            cart.products[productIndex].quantity++
        }// Si el producto ya está en el carrito, aumenta la cantidad en 1

        await fs.promises.writeFile(pathFile, JSON.stringify(carts), "utf8") // Escribimos los cambios nuevamente en el archivo carts.json
        return cart
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error)
        throw new Error("Error al agregar producto al carrito")
    }
}

export { getCarts, createCart, getCartById, addProductToCart }

