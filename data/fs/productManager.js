import fs from "fs" // Inicializamos file system

let products = [] // Creamos la lista de productos vacía

let pathFile = "./data/fs/files/products.json" // Ruta de los productos

// Crear un producto nuevo

const addProduct = async (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
        id: products.length + 1, // id autoincrementable,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    }

    // Controlamos que todos los campos sean obligatorios

    if (Object.values(newProduct).includes(undefined)) {
        console.log("Todos los campos son obligatorios")
        return // El return es para que no entre en el push y no agregue el producto
    }

    // Si el código se repite, no se agrega el producto y nos muestra el siguiente mensaje:

    const existentProduct = products.find(product => product.code === code)
    if (existentProduct) {
        console.log(`Oops. El artículo ${title} con el código ${code} ya existe`)
        return
    }
    products.push(newProduct)

    await fs.promises.writeFile(pathFile, JSON.stringify(products))
}

// Obtener/leer los productos (getProducts)

const getProducts = async () => {
    const productsJson = await fs.promises.readFile(pathFile, "utf8")
    products = JSON.parse(productsJson) || []  // Si no hay información a la hora de leerlo, se asigna un array vacío 
    return products
}

// Buscar un producto por su id (getProductById)

const getProductById = async (id) => {
    await getProducts() // llamamos a la función para que lea el JSON y nuestros productos se asignen a la variable 
    const productId = parseInt(id) // convertimos el ID a número
    const product = products.find(product => product.id === productId) // que busque el producto cuyo id coincida con el que estamos recibiendo por parámetro
    if (!product) {
        console.log(`El producto con el id ${productId} no existe`)
        return
    }
    console.log(product)
    return product
}

// Actualizar un producto (updateProduct)

const updateProduct = async (id, dataProduct) => {
    await getProducts()
    const index = products.findIndex(product => product.id === id) // Buscamos el valor índice de nuestro producto
    products[index] = {
        ...products[index], // hacemos una copia de las propiedades del product
        ...dataProduct // sobreescribimos las propiedades que se reciban por dataProduct
    }
    await fs.promises.writeFile(pathFile, JSON.stringify(products)) // sobreescribimos el archivo con la nueva información
}

// Eliminar un producto (deleteProduct)

const deleteProduct = async (id) => {
    await getProducts()
    products = products.filter(product => product.id !== id) // devuelve todos los productos menos el del id que recibe por parámetro
    await fs.promises.writeFile(pathFile, JSON.stringify(products))
}

//Agregar nuevos productos

// /*Producto 1*/ addProduct("Remera Star Wars", "Remera negra talle XL con diseño Star Wars", 12000, "http://www.ropacanchera.com/remeras-star-wars-1", "CGTP1234", 10)

// /*Producto 2*/ addProduct("Pantalón Marvel", "Pantalón blanco talle 40 con diseño Marvel", 25000, "http://www.ropacanchera.com/pantalones-marvel-3", "CGTP1235", 5)

// /*Producto 3*/ addProduct("Campera My Hero Academia", "Campera negra talle S con diseño My Hero Academia", 50000, "http://www.ropacanchera.com/camperas-my-hero-academia-1", "CGTP1236", 2)

// /*Producto 4*/ addProduct("Remera My Hero Academia", "Remera negra talle XS con diseño My Hero Academia", 12000, "http://www.ropacanchera.com/remeras-my-hero-academia-2", "CGTP1237", 8)

// /*Producto 5*/ addProduct("Pantalón Star Wars", "Pantalón rosa talle 42 con diseño Star Wars", 26000, "http://www.ropacanchera.com/pantalones-star-wars-2", "CGTP1238", 12)

// /*Producto 6*/ addProduct("Buzo Marvel", "Buzo beige talle L con diseño Marvel", 40000, "http://www.ropacanchera.com/buzos-marvel-1", "CGTP1239", 10)

// /*Producto 7*/ addProduct("Campera My Hero Academia", "Campera blanca talle L con diseño My Hero Academia", 50000, "http://www.ropacanchera.com/camperas-my-hero-academia-2", "CGTP1240", 1)

// /*Producto 8*/ addProduct("Remera Star Wars", "Remera fucsia talle XXS con diseño Star Wars", 12000, "http://www.ropacanchera.com/remeras-star-wars-2", "CGTP1241", 4)

// /*Producto 9*/ addProduct("Remera Dragon Ball Z", "Remera amarilla talle S con diseño Dragon Ball Z", 12000, "http://www.ropacanchera.com/remeras-dragon-ball-1", "CGTP1242", 2)

// /*Producto 10*/ addProduct("Buzo Marvel", "Buzo crudo talle XL con diseño Marvel", 40000, "http://www.ropacanchera.com/buzos-marvel-2", "CGTP1243", 3)

getProducts()

// console.log("----------------Prueba: Buscar un producto por su id")

// getProductById(1)

// console.log("----------------Prueba: Buscar un producto cuyo id no existe")

// getProductById(5)

// //Prueba: Actualizar la información de un producto

// updateProduct(3, {
//     title: "Campera Dragon Ball",
//     description: "Campera negra talle S con diseño Dragon Ball",
// })

// // Prueba: Borrar un producto

// deleteProduct(2)

export { addProduct, getProducts, getProductById, updateProduct, deleteProduct }