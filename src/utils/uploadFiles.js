import multer from "multer"
import path from "path"
import fs from "fs"
import customErrors from "../errors/customErrors.js"

//Función para crear los directorios con filesystem 

const ensureDirectoryExists = () => {
    const directories = ["public/uploads/profiles", "public/uploads/products", "public/uploads/documents"]

    directories.forEach((dir) => {
        if(!fs.existsSync(dir)) { // nos devuelve true or false verificando que existan los 3 directorios
            fs.mkdirSync(dir, {recursive: true}) // Si no existe lo crea
        }
    })
}

ensureDirectoryExists()

// Configuramos el storage

const storage = multer.diskStorage({ // le indicamos en qué lugar del disco rígido se va a guardar
    destination: (req, file, cb) => {
        if(file.fieldname === "profile") {
            cb(null, "./public/uploads/profiles")
        } else if (file.fieldname === "productImg") {
            cb(null, "./public/uploads/products")
        } else if (file.fieldname === "document") {
            cb(null, "./public/uploads/documents")
        } else {
            cb(customErrors.badRequestError("Invalid fieldname"), null)
        }
    },
    filename: (req, file, cb) => {
        const userId = req.user._id
        const extension = path.extname(file.originalname) // Obtenemos la extensión del archivo (ej: jpg)
        const basename = path.basename(file.originalname, extension) // Obtenemos el nombre del archivo sin la extensión
        cb(null, `${basename}-${userId}${extension}`)
    },
})

export const upload = multer({ storage }) // vamos a usarlo como middleware