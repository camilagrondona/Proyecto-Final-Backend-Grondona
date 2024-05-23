import express from "express"   
import router from "./routes/index.js"
import {connectMongoDB} from "./config/mongoDb.config.js"

connectMongoDB() // Conexión con MongoDB

const app = express() // Creamos la app de express ejecutando la función. Se creó el servidor.

// Configuramos el servidor con determinadas funcionalidades (middlewares):

app.use(express.json()) // Para manejar json
app.use(express.urlencoded({ extended: true })) // Para leer querys y params
app.use("/api", router) // Agregamos el prefijo api a nuestras rutas

// Inicializamos la app de express configurando: 

// 1) El puerto donde se inicializa el servidor

const port = 3000

// 2) Función ready, para que cuando el servidor esté inicializado nos muestre en consola el siguiente mensaje: 

const ready = console.log("Server ready on port " + port)

// Para inicializar el servidor, necesito escuchar el puerto 8080 y luego de que se levantó ejecutar la callback ready 

app.listen(port, ready) // Está inicializado pero aún no está funcionando; para ello, hay que correr en la consola el comando "npm run dev"

