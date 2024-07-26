import fs from "fs" // Inicializamos file system

let products = [] // Creamos la lista de productos vacía

let pathFile = "./src/data/fs/files/products.json" // Ruta de los productos

// Crear un producto nuevo (addProduct)

const addProduct = async (product) => {
    const {title, description, price, thumbnail, code, stock, status} = product
    await getProducts()
    const newProduct = {
        id: products.length + 1, 
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status: true
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

const getProducts = async (limit) => {
    const productsJson = await fs.promises.readFile(pathFile, "utf8")
    products = JSON.parse(productsJson) || []  // Si no hay información a la hora de leerlo, se asigna un array vacío 
    if (!limit) return products // Si no se recibe el límite retorna todos los productos

    return products.slice(0, limit) // Si hay un límite, recorta la cantidad desde la posición 0 del array hasta el limite que se recibe por parámetro
}

// Buscar un producto por su id (getProductById)

const getProductById = async (id) => {
    await getProducts() // llamamos a la función para que lea el JSON y nuestros productos se asignen a la variable 
    const product = products.find(product => product.id === id) // que busque el producto cuyo id coincida con el que estamos recibiendo por parámetro
    if (!product) {
        console.log(`El producto con el id ${id} no existe`)
        return
    }
    console.log(product)
    return product
}

// Actualizar un producto (updateProduct)

const updateProduct = async (id, dataProduct) => {
    await getProducts()
    console.log("Actualizando producto con ID:", id)
    console.log("Información actualizada:", dataProduct)
    const index = products.findIndex((product) => product.id === id) // Buscamos el valor índice de nuestro producto
    products[index] = {
        ...products[index], // hacemos una copia de las propiedades del product
        ...dataProduct // sobreescribimos las propiedades que se reciban por dataProduct
    }
    await fs.promises.writeFile(pathFile, JSON.stringify(products)) // sobreescribimos el archivo con la nueva información
    console.log("Producto actualizado correctamente")
}

// Eliminar un producto (deleteProduct)

const deleteProduct = async (id) => {
    await getProducts()
    products = products.filter(product => product.id !== id) // devuelve todos los productos menos el del id que recibe por parámetro
    await fs.promises.writeFile(pathFile, JSON.stringify(products))
}


export { addProduct, getProducts, getProductById, updateProduct, deleteProduct }

